import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common'
import { InvoicesService } from './invoices.service'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { UpdateInvoiceDto } from './dto/update-invoice.dto'

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  @Get()
  findAll(
    @Query('month') month?: string,
    @Query('roomId') roomId?: string,
    @Query('status') status?: string,
  ) { return this.service.findAll(month, roomId, status) }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id) }

  @Post()
  create(@Body() dto: CreateInvoiceDto, @Query('status') status?: string) {
    return this.service.create(dto, status === 'issued' ? 'ISSUED' : 'DRAFT')
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) { return this.service.update(id, dto) }

  @Post(':id/issue')
  issue(@Param('id') id: string) { return this.service.issue(id) }

  @Post(':id/mark-paid')
  markPaid(@Param('id') id: string) { return this.service.markPaid(id) }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id) }
}
