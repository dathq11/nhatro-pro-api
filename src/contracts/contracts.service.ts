import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateContractDto } from './dto/create-contract.dto'
import { UpdateContractDto } from './dto/update-contract.dto'

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  findAll(status?: string) {
    return this.prisma.contract.findMany({
      where: status && status !== 'all' ? { status: status.toUpperCase() as any } : undefined,
      include: { tenant: true, room: { include: { property: true } } },
      orderBy: { signDate: 'desc' },
    })
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: { tenant: true, room: true, invoices: true },
    })
    if (!contract) throw new NotFoundException('Không tìm thấy hợp đồng')
    return contract
  }

  findByRoom(roomId: string) {
    return this.prisma.contract.findMany({
      where: { roomId },
      include: { tenant: true },
      orderBy: { signDate: 'desc' },
    })
  }

  async create(dto: CreateContractDto) {
    const active = await this.prisma.contract.findFirst({
      where: { roomId: dto.roomId, status: 'ACTIVE' },
    })
    if (active) throw new BadRequestException('Phòng đã có hợp đồng hiệu lực')

    const signDate = new Date(dto.signDate)
    const endDate = new Date(signDate)
    endDate.setMonth(endDate.getMonth() + dto.months)

    const [contract] = await this.prisma.$transaction([
      this.prisma.contract.create({
        data: { ...dto, signDate, endDate, vehicles: dto.vehicles ?? 0 },
        include: { tenant: true },
      }),
      this.prisma.room.update({
        where: { id: dto.roomId },
        data: { status: 'OCCUPIED' },
      }),
    ])
    return contract
  }

  async update(id: string, dto: UpdateContractDto) {
    const contract = await this.findOne(id)
    const updated = await this.prisma.contract.update({ where: { id }, data: dto })

    if (dto.status === 'TERMINATED' || dto.status === 'EXPIRED') {
      await this.prisma.room.update({
        where: { id: contract.roomId },
        data: { status: 'VACANT' },
      })
    }
    return updated
  }
}
