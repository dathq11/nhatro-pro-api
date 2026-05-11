import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common'
import { TenantsService } from './tenants.service'
import { CreateTenantDto } from './dto/create-tenant.dto'
import { UpdateTenantDto } from './dto/update-tenant.dto'

@Controller('tenants')
export class TenantsController {
  constructor(private readonly service: TenantsService) {}

  @Get()
  findAll() { return this.service.findAll() }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id) }

  @Post()
  create(@Body() dto: CreateTenantDto) { return this.service.create(dto) }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) { return this.service.update(id, dto) }
}
