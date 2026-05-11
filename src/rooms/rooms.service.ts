import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  findByProperty(propertyId: string) {
    return this.prisma.room.findMany({
      where: { propertyId },
      include: {
        contracts: { where: { status: 'ACTIVE' }, include: { tenant: true } },
        invoices: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { name: 'asc' },
    })
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        contracts: { include: { tenant: true } },
        invoices: { orderBy: { createdAt: 'desc' } },
      },
    })
    if (!room) throw new NotFoundException('Không tìm thấy phòng')
    return room
  }

  create(propertyId: string, dto: CreateRoomDto) {
    return this.prisma.room.create({
      data: { name: dto.name, rent: dto.rent, propertyId },
    })
  }

  async update(id: string, dto: UpdateRoomDto) {
    return this.prisma.room.update({ where: { id }, data: dto })
  }

  async remove(id: string) {
    return this.prisma.room.delete({ where: { id } })
  }
}
