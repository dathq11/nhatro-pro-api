import { IsString, IsOptional } from 'class-validator'

export class CreateTenantDto {
  @IsString()
  name: string

  @IsOptional() @IsString()
  cccd?: string

  @IsOptional() @IsString()
  phone?: string
}
