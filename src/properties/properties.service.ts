import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePropertyDto } from './dto/create-property.dto'
import { UpdatePropertyDto } from './dto/update-property.dto'

const TEMP_USER_ID = 'user-1'

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.property.findMany({
      where: { userId: TEMP_USER_ID },
      include: {
        rooms: {
          include: {
            contracts: { where: { status: 'ACTIVE' }, include: { tenant: true } },
            invoices: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    })
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findFirst({
      where: { id, userId: TEMP_USER_ID },
      include: { rooms: true },
    })
    if (!property) throw new NotFoundException('Không tìm thấy toà nhà')
    return property
  }

  async create(dto: CreatePropertyDto) {
    const exists = await this.prisma.property.findFirst({ where: { userId: TEMP_USER_ID, name: dto.name } })
    if (exists) throw new BadRequestException('Tên toà nhà đã tồn tại')
    return this.prisma.property.create({
      data: { ...dto, contractStart: new Date(dto.contractStart), userId: TEMP_USER_ID },
    })
  }

  async update(id: string, dto: UpdatePropertyDto) {
    if (dto.name) {
      const exists = await this.prisma.property.findFirst({ where: { userId: TEMP_USER_ID, name: dto.name, NOT: { id } } })
      if (exists) throw new BadRequestException('Tên toà nhà đã tồn tại')
    }
    return this.prisma.property.update({
      where: { id },
      data: { ...dto, ...(dto.contractStart && { contractStart: new Date(dto.contractStart) }) },
    })
  }

  async remove(id: string) {
    return this.prisma.property.delete({ where: { id } })
  }
}
