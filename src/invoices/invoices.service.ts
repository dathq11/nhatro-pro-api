import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateInvoiceDto } from './dto/create-invoice.dto'
import { UpdateInvoiceDto } from './dto/update-invoice.dto'

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  findAll(month?: string, roomId?: string, status?: string) {
    return this.prisma.invoice.findMany({
      where: {
        ...(month ? { month } : {}),
        ...(roomId ? { roomId } : {}),
        ...(status ? { status: status.toUpperCase() as any } : {}),
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            property: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { room: true, contract: true },
    })
    if (!invoice) throw new NotFoundException('Không tìm thấy hoá đơn')
    return invoice
  }

  async create(dto: CreateInvoiceDto, status: 'DRAFT' | 'ISSUED' = 'DRAFT') {
    const [existing, countInMonth] = await Promise.all([
      this.prisma.invoice.findFirst({
        where: { roomId: dto.roomId, month: dto.month, status: { not: 'DRAFT' } },
        select: { id: true },
      }),
      this.prisma.invoice.count({ where: { month: dto.month } }),
    ])
    if (existing) throw new BadRequestException(`Phòng đã có hoá đơn tháng ${dto.month}`)

    const electricAmount = (dto.electricKwh ?? 0) * (dto.electricPrice ?? 4000)
    const waterAmount = (dto.waterM3 ?? 0) * (dto.waterPrice ?? 15000)
    const otherFees = dto.otherFees ?? []
    const otherTotal = otherFees.reduce((s, f) => s + f.amount, 0)
    const totalAmount = dto.rentAmount + electricAmount + waterAmount +
      (dto.internetAmount ?? 0) + (dto.serviceAmount ?? 0) + otherTotal

    const invoiceNumber = `INV-${dto.month}-${String(countInMonth + 1).padStart(3, '0')}`

    return this.prisma.invoice.create({
      data: {
        invoiceNumber,
        month: dto.month,
        roomId: dto.roomId,
        contractId: dto.contractId,
        tenantName: dto.tenantName,
        rentAmount: dto.rentAmount,
        electricKwh: dto.electricKwh ?? 0,
        electricPrice: dto.electricPrice ?? 4000,
        electricAmount,
        waterM3: dto.waterM3 ?? 0,
        waterPrice: dto.waterPrice ?? 15000,
        waterAmount,
        internetAmount: dto.internetAmount ?? 0,
        serviceAmount: dto.serviceAmount ?? 0,
        otherFees: otherFees as any,
        totalAmount,
        note: dto.note ?? '',
        status,
        ...(status === 'ISSUED' ? { issuedAt: new Date() } : {}),
      },
    })
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      select: {
        status: true,
        electricKwh: true, electricPrice: true,
        waterM3: true, waterPrice: true,
        rentAmount: true, internetAmount: true,
        serviceAmount: true, otherFees: true,
      },
    })
    if (!invoice) throw new NotFoundException('Không tìm thấy hoá đơn')

    const electricAmount = ((dto.electricKwh ?? invoice.electricKwh) * (dto.electricPrice ?? invoice.electricPrice))
    const waterAmount = ((dto.waterM3 ?? invoice.waterM3) * (dto.waterPrice ?? invoice.waterPrice))
    const otherFees = (dto.otherFees ?? invoice.otherFees) as { label: string; amount: number }[]
    const otherTotal = otherFees.reduce((s, f) => s + f.amount, 0)
    const totalAmount = (dto.rentAmount ?? invoice.rentAmount) + electricAmount + waterAmount +
      (dto.internetAmount ?? invoice.internetAmount) + (dto.serviceAmount ?? invoice.serviceAmount) + otherTotal

    return this.prisma.invoice.update({
      where: { id },
      data: { ...dto, electricAmount, waterAmount, otherFees, totalAmount },
    })
  }

  async issue(id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id }, select: { status: true } })
    if (!invoice) throw new NotFoundException('Không tìm thấy hoá đơn')
    if (invoice.status !== 'DRAFT') throw new BadRequestException('Chỉ phát hành hoá đơn lưu nháp')
    return this.prisma.invoice.update({
      where: { id },
      data: { status: 'ISSUED', issuedAt: new Date() },
    })
  }

  async markPaid(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      select: { status: true, roomId: true, contractId: true, totalAmount: true, invoiceNumber: true },
    })
    if (!invoice) throw new NotFoundException('Không tìm thấy hoá đơn')
    if (invoice.status !== 'ISSUED') throw new BadRequestException('Hoá đơn chưa được phát hành')

    const [updated] = await this.prisma.$transaction([
      this.prisma.invoice.update({
        where: { id },
        data: { status: 'PAID', paidAt: new Date() },
      }),
      this.prisma.room.update({
        where: { id: invoice.roomId },
        data: { status: 'OCCUPIED' },
      }),
      this.prisma.transaction.create({
        data: {
          type: 'INCOME',
          category: 'RENT',
          amount: invoice.totalAmount,
          date: new Date(),
          note: `Thu tiền hoá đơn ${invoice.invoiceNumber}`,
          roomId: invoice.roomId,
          contractId: invoice.contractId,
          invoiceId: id,
        },
      }),
    ])
    return updated
  }

  async remove(id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id }, select: { status: true } })
    if (!invoice) throw new NotFoundException('Không tìm thấy hoá đơn')
    return this.prisma.invoice.delete({ where: { id } })
  }
}
