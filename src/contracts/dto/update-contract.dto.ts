import { IsString, IsOptional } from 'class-validator'

export class UpdateContractDto {
  @IsOptional() @IsString()
  status?: 'ACTIVE' | 'EXPIRED' | 'TERMINATED'
}
