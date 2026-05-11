import { IsString, IsInt, IsOptional, Min } from 'class-validator'

export class CreateRoomDto {
  @IsString()
  name: string

  @IsInt() @Min(0)
  rent: number

  @IsOptional() @IsString()
  propertyId?: string
}
