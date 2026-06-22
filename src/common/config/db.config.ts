import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { getEnvValue } from './config.loader';

export const createTypeOrmConfig = async (): Promise<TypeOrmModuleOptions> => {
  return {
    autoLoadEntities: true,
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: getEnvValue('DB_HOST'),
    port: parseInt(getEnvValue('DB_PORT'), 10),
    username: getEnvValue('DB_USERNAME'),
    password: getEnvValue('DB_PASSWORD'),
    database: getEnvValue('DB_NAME'),
    entities: [__dirname + '/../../**/*.entity.{ts,js}'],
    synchronize: true,
  };
};
