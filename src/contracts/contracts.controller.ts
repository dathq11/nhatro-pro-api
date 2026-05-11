import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common'
import { ContractsService } from './contracts.service'
import { CreateContractDto } from './dto/create-contract.dto'
import { UpdateContractDto } from './dto/update-contract.dto'

@Controller()
export class ContractsController {
  constructor(private readonly service: ContractsService) {}

  @Get('contracts')
  findAll(@Query('status') status?: string) { return this.service.findAll(status) }

  @Get('contracts/:id')
  findOne(@Param('id') id: string) { return this.service.findOne(id) }

  @Get('rooms/:roomId/contracts')
  findByRoom(@Param('roomId') roomId: string) { return this.service.findByRoom(roomId) }

  @Post('contracts')
  create(@Body() dto: CreateContractDto) { return this.service.create(dto) }

  @Patch('contracts/:id')
  update(@Param('id') id: string, @Body() dto: UpdateContractDto) { return this.service.update(id, dto) }
}
