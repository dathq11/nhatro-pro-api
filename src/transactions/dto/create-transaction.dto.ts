import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export enum TransactionType { INCOME = 'INCOME', EXPENSE = 'EXPENSE' }
export enum TransactionCategory { RENT = 'RENT', DEPOSIT = 'DEPOSIT', REPAIR = 'REPAIR', UTILITIES = 'UTILITIES', OTHER = 'OTHER' }

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType

  @IsEnum(TransactionCategory)
  category: TransactionCategory

  @Type(() => Number)
  @IsInt()
  @Min(1)
  amount: number

  @IsISO8601()
  date: string

  @IsOptional()
  @IsString()
  note?: string

  @IsOptional()
  @IsString()
  roomId?: string

  @IsOptional()
  @IsString()
  propertyId?: string

  @IsOptional()
  @IsString()
  contractId?: string
}
