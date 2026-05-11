import { IsString, IsInt, IsOptional, IsArray, ValidateNested, Min } from 'class-validator'
import { Type } from 'class-transformer'

class OtherFeeDto {
  @IsString() label: string
  @IsInt() @Min(0) amount: number
}

export class CreateInvoiceDto {
  @IsString()
  roomId: string

  @IsOptional() @IsString()
  contractId?: string

  @IsString()
  month: string

  @IsString()
  tenantName: string

  @IsInt() @Min(0)
  rentAmount: number

  @IsOptional() @IsInt() @Min(0) electricKwh?: number
  @IsOptional() @IsInt() @Min(0) electricPrice?: number
  @IsOptional() @IsInt() @Min(0) waterM3?: number
  @IsOptional() @IsInt() @Min(0) waterPrice?: number
  @IsOptional() @IsInt() @Min(0) internetAmount?: number
  @IsOptional() @IsInt() @Min(0) serviceAmount?: number

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => OtherFeeDto)
  otherFees?: OtherFeeDto[]

  @IsOptional() @IsString()
  note?: string
}
