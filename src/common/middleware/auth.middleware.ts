import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { UserService } from '@/user/user.service';
import { UserSessionService } from '../sessionUser/user-session.service';
import { PinoLogger } from 'nestjs-pino';
import { PUBLIC_ENDPOINTS } from '../utils/constant';
import { NextFunction, Request, Response } from 'express';
import { ErrorEnum } from '@/enums/errorCode.enum';
import * as jwt from 'jsonwebtoken';
import { getEnvValue } from '../config/config.loader';
import { ResourceNotFoundException } from '../exception/resource-not-found.exception';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly publicEndpoints: string[];
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly userSessionService: UserSessionService,
    private readonly logger: PinoLogger,
  ) {
    this.publicEndpoints = PUBLIC_ENDPOINTS.map((endpoint) => endpoint.trim());
    this.logger.setContext(AuthMiddleware.name);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (this.isPublicEndpoint(req.baseUrl)) {
      return next();
    }
    const authHeader = req.header('Authorizaton');
    if (!authHeader) {
      throw new UnauthorizedException(ErrorEnum.HEADERS_MISSING);
    }
    const token = authHeader.split(' ')[1];
    try {
      const verifyToken = jwt.verify(token, getEnvValue('JWT_SECRET'));
    } catch (error) {
      throw new UnauthorizedException('Invalid or Expired Token');
    }
    next();
  }

  private isPublicEndpoint(path: string): boolean {
    return this.publicEndpoints.some((endpoint) => path.startsWith(endpoint));
  }

  private async setUserDetailsFromToken(
    token: string,
    deviceToken?: string,
  ): Promise<any> {
    const userSession = await this.redisService.getUserSessionByToken(token);
    if (!userSession) {
      throw new UnauthorizedException(ErrorEnum.INVALID_OR_EXPIRED_SESSION);
    }
    const casId = userSession['user.id'];
    if (!casId)
      throw new UnauthorizedException(ErrorEnum.INVALID_OR_EXPIRED_SESSION);
    const userDeviceToken = userSession['deviceToken'];
    if (deviceToken !== userDeviceToken) {
      throw new UnauthorizedException(ErrorEnum.INVALID_DEVICE_TOKEN);
    }
    const userDetails = await this.userService.getDetailsByEmail(casId);
    if (!userDetails) throw new ResourceNotFoundException('user', 'id', casId);
    this.userSessionService.setSessionUser(userDetails);
    return true;
  }
}
