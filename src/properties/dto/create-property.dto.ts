import { IsString, IsInt, IsDateString, IsOptional, IsArray, Min } from 'class-validator'

export class CreatePropertyDto {
  @IsString()
  name: string

  @IsString()
  address: string

  @IsInt() @Min(1)
  floors: number

  @IsInt() @Min(1)
  totalRooms: number

  @IsInt() @Min(1)
  contractMonths: number

  @IsDateString()
  contractStart: string

  @IsInt() @Min(0)
  baseRent: number

  @IsOptional() @IsArray() @IsString({ each: true })
  photos?: string[]
}
