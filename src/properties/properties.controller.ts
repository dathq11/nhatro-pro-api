import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common'
import { PropertiesService } from './properties.service'
import { CreatePropertyDto } from './dto/create-property.dto'
import { UpdatePropertyDto } from './dto/update-property.dto'

@Controller('properties')
export class PropertiesController {
  constructor(private readonly service: PropertiesService) {}

  @Get()
  findAll() { return this.service.findAll() }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id) }

  @Post()
  create(@Body() dto: CreatePropertyDto) { return this.service.create(dto) }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePropertyDto) { return this.service.update(id, dto) }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id) }
}
