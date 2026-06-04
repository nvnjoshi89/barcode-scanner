import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class HeaderDto {
  @IsString()
  @IsNotEmpty()
  'X-client-type': string;

  @IsString()
  @IsEmail()
  'X-device-token': string;

  @IsString()
  @IsEmail()
  'client_id': string;
}
