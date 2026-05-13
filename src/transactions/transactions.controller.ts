import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('propertyId') propertyId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) { return this.service.findAll(type, propertyId, from, to) }

  @Post()
  create(@Body() dto: CreateTransactionDto) { return this.service.create(dto) }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) { return this.service.update(id, dto) }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id) }
}
