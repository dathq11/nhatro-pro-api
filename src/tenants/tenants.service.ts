import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTenantDto } from './dto/create-tenant.dto'
import { UpdateTenantDto } from './dto/update-tenant.dto'

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tenant.findMany({ orderBy: { name: 'asc' } })
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: { contracts: { include: { room: true } } },
    })
    if (!tenant) throw new NotFoundException('Không tìm thấy người thuê')
    return tenant
  }

  create(dto: CreateTenantDto) {
    return this.prisma.tenant.create({ data: dto })
  }

  async update(id: string, dto: UpdateTenantDto) {
    await this.findOne(id)
    return this.prisma.tenant.update({ where: { id }, data: dto })
  }
}
