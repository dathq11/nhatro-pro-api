import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  findAll(type?: string, propertyId?: string, from?: string, to?: string) {
    return this.prisma.transaction.findMany({
      where: {
        ...(type ? { type: type.toUpperCase() as any } : {}),
        ...(from || to
          ? { date: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } }
          : {}),
        ...(propertyId
          ? { OR: [{ room: { propertyId } }, { propertyId }] }
          : {}),
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            property: { select: { id: true, name: true } },
          },
        },
        property: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
    })
  }

  async create(dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        type: dto.type,
        category: dto.category,
        amount: dto.amount,
        date: new Date(dto.date),
        note: dto.note ?? '',
        ...(dto.roomId ? { roomId: dto.roomId } : {}),
        ...(dto.propertyId ? { propertyId: dto.propertyId } : {}),
        ...(dto.contractId ? { contractId: dto.contractId } : {}),
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            property: { select: { id: true, name: true } },
          },
        },
        property: { select: { id: true, name: true } },
      },
    })
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const tx = await this.prisma.transaction.findUnique({ where: { id } })
    if (!tx) throw new NotFoundException('Không tìm thấy giao dịch')
    if (Date.now() - tx.createdAt.getTime() > EDIT_WINDOW_MS)
      throw new ForbiddenException('Chỉ được sửa giao dịch trong vòng 24 giờ')

    return this.prisma.transaction.update({
      where: { id },
      data: {
        ...(dto.type ? { type: dto.type } : {}),
        ...(dto.category ? { category: dto.category } : {}),
        ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
        ...(dto.date ? { date: new Date(dto.date) } : {}),
        ...(dto.note !== undefined ? { note: dto.note } : {}),
        ...(dto.roomId !== undefined ? { roomId: dto.roomId || null } : {}),
        ...(dto.propertyId !== undefined ? { propertyId: dto.propertyId || null } : {}),
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            property: { select: { id: true, name: true } },
          },
        },
        property: { select: { id: true, name: true } },
      },
    })
  }

  async remove(id: string) {
    const tx = await this.prisma.transaction.findUnique({ where: { id } })
    if (!tx) throw new NotFoundException('Không tìm thấy giao dịch')
    if (Date.now() - tx.createdAt.getTime() > EDIT_WINDOW_MS)
      throw new ForbiddenException('Chỉ được xoá giao dịch trong vòng 24 giờ')
    return this.prisma.transaction.delete({ where: { id } })
  }
}
