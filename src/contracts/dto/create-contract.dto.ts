import { IsString, IsInt, IsDateString, IsOptional, Min } from 'class-validator'

export class CreateContractDto {
  @IsString()
  roomId: string

  @IsString()
  tenantId: string

  @IsInt() @Min(0)
  rent: number

  @IsInt() @Min(1)
  months: number

  @IsDateString()
  signDate: string

  @IsOptional() @IsInt() @Min(0)
  vehicles?: number

  @IsOptional() @IsInt() @Min(1)
  occupants?: number
}
