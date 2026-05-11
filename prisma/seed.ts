import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

type RoomSeed = {
  name: string
  rent: number
  status: 'VACANT' | 'OCCUPIED' | 'EXPIRING_SOON'
  contract?: {
    tenantName: string
    tenantCccd: string
    rent: number
    months: number
    signDate: Date
    vehicles: number
  }
}

type InvoiceSeed = {
  prop: string
  room: string
  month: string // YYYY-MM
  tenantName: string
  rentAmount: number
  elecKwh: number
  elecPrice: number
  elecAmt: number
  waterM3: number
  waterPrice: number
  waterAmt: number
  internet: number
  service: number
  otherFees: { label: string; amount: number }[]
  total: number
  status: 'DRAFT' | 'ISSUED' | 'PAID'
}

// ── Room definitions ──────────────────────────────────────────────────────────

const ROOMS: Record<string, RoomSeed[]> = {
  'Toà A': [
    { name: 'P.101', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Nguyễn Văn An',    tenantCccd: '079201012345', rent: 2_500_000, months: 12, signDate: new Date(2025, 10, 15), vehicles: 2 } },
    { name: 'P.102', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Trần Thị Bình',    tenantCccd: '079301023456', rent: 2_500_000, months: 12, signDate: new Date(2025,  7, 15), vehicles: 1 } },
    { name: 'P.103', rent: 2_500_000, status: 'VACANT' },
    { name: 'P.104', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Đỗ Thị Hương',     tenantCccd: '079401034567', rent: 2_500_000, months: 12, signDate: new Date(2025,  5, 20), vehicles: 3 } },
    { name: 'P.201', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Lê Hoàng Nam',     tenantCccd: '079501067890', rent: 2_800_000, months: 12, signDate: new Date(2026,  2, 15), vehicles: 1 } },
    { name: 'P.202', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Phạm Minh Tuấn',   tenantCccd: '079601078901', rent: 2_800_000, months: 12, signDate: new Date(2025,  8, 15), vehicles: 1 } },
    { name: 'P.203', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Hoàng Thị Lan',    tenantCccd: '079701089012', rent: 2_800_000, months: 12, signDate: new Date(2025, 11, 15), vehicles: 2 } },
    { name: 'P.204', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Vũ Quang Huy',     tenantCccd: '079801001234', rent: 2_800_000, months: 12, signDate: new Date(2025,  6, 15), vehicles: 1 } },
    { name: 'P.205', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Tô Văn Hải',       tenantCccd: '079901012345', rent: 2_800_000, months: 12, signDate: new Date(2026,  4,  1), vehicles: 1 } },
    { name: 'P.301', rent: 2_800_000, status: 'EXPIRING_SOON', contract: { tenantName: 'Đặng Văn Đức',     tenantCccd: '079101023456', rent: 2_800_000, months: 12, signDate: new Date(2025,  4, 14), vehicles: 4 } },
    { name: 'P.302', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Bùi Thị Mai',      tenantCccd: '079201067890', rent: 2_800_000, months: 12, signDate: new Date(2026,  1, 15), vehicles: 1 } },
    { name: 'P.303', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Ngô Văn Tùng',     tenantCccd: '079301078901', rent: 2_800_000, months: 12, signDate: new Date(2025,  9, 15), vehicles: 1 } },
    { name: 'P.304', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Lý Thị Hoa',       tenantCccd: '079401089012', rent: 2_800_000, months: 12, signDate: new Date(2026,  0, 15), vehicles: 2 } },
    { name: 'P.305', rent: 2_800_000, status: 'VACANT' },
    { name: 'P.401', rent: 3_000_000, status: 'OCCUPIED',      contract: { tenantName: 'Đinh Văn Sơn',     tenantCccd: '079501001234', rent: 3_000_000, months: 12, signDate: new Date(2026,  3, 15), vehicles: 1 } },
    { name: 'P.402', rent: 3_000_000, status: 'OCCUPIED',      contract: { tenantName: 'Cao Thị Thu',      tenantCccd: '079601012345', rent: 3_000_000, months: 12, signDate: new Date(2025,  5, 20), vehicles: 1 } },
    { name: 'P.403', rent: 3_000_000, status: 'OCCUPIED',      contract: { tenantName: 'Trương Văn Long',  tenantCccd: '079701023456', rent: 3_000_000, months: 12, signDate: new Date(2025,  7, 15), vehicles: 1 } },
    { name: 'P.404', rent: 3_000_000, status: 'OCCUPIED',      contract: { tenantName: 'Lâm Thị Ngọc',    tenantCccd: '079801034567', rent: 3_000_000, months: 12, signDate: new Date(2025, 10, 15), vehicles: 2 } },
    { name: 'P.501', rent: 3_200_000, status: 'OCCUPIED',      contract: { tenantName: 'Vương Văn Hùng',   tenantCccd: '079901056789', rent: 3_200_000, months: 12, signDate: new Date(2026,  1, 15), vehicles: 1 } },
    { name: 'P.502', rent: 3_200_000, status: 'OCCUPIED',      contract: { tenantName: 'Dương Thị Thảo',   tenantCccd: '079101067890', rent: 3_200_000, months: 12, signDate: new Date(2025,  8, 15), vehicles: 1 } },
    { name: 'P.503', rent: 3_200_000, status: 'EXPIRING_SOON', contract: { tenantName: 'Hứa Văn Tài',     tenantCccd: '079201078901', rent: 3_200_000, months: 12, signDate: new Date(2025,  4, 19), vehicles: 1 } },
    { name: 'P.504', rent: 3_200_000, status: 'OCCUPIED',      contract: { tenantName: 'Mạc Thị Linh',    tenantCccd: '079301089012', rent: 3_200_000, months: 12, signDate: new Date(2026,  6, 15), vehicles: 1 } },
  ],
  'Toà B': [
    { name: 'P.101', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Hồ Thị Ánh',      tenantCccd: '079401090123', rent: 2_500_000, months: 12, signDate: new Date(2025,  8, 15), vehicles: 1 } },
    { name: 'P.102', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Mai Văn Tâm',     tenantCccd: '079501001234', rent: 2_500_000, months: 12, signDate: new Date(2025, 10, 15), vehicles: 2 } },
    { name: 'P.103', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Chu Thị Nga',     tenantCccd: '079601023456', rent: 2_500_000, months: 12, signDate: new Date(2025,  7, 15), vehicles: 1 } },
    { name: 'P.104', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Từ Văn Lộc',      tenantCccd: '079701034567', rent: 2_500_000, months: 12, signDate: new Date(2026,  0, 15), vehicles: 1 } },
    { name: 'P.201', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Doãn Văn Hùng',   tenantCccd: '079801045678', rent: 2_800_000, months: 12, signDate: new Date(2025, 11, 15), vehicles: 2 } },
    { name: 'P.202', rent: 2_800_000, status: 'EXPIRING_SOON', contract: { tenantName: 'Tạ Thị Liên',     tenantCccd: '079901067890', rent: 2_800_000, months: 12, signDate: new Date(2025,  4, 21), vehicles: 1 } },
    { name: 'P.203', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Phan Văn Minh',   tenantCccd: '079101078901', rent: 2_800_000, months: 12, signDate: new Date(2026,  2, 15), vehicles: 1 } },
    { name: 'P.204', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Lương Thị Yến',   tenantCccd: '079201089012', rent: 2_800_000, months: 12, signDate: new Date(2026,  0, 15), vehicles: 1 } },
    { name: 'P.205', rent: 2_800_000, status: 'VACANT' },
    { name: 'P.301', rent: 3_000_000, status: 'OCCUPIED',      contract: { tenantName: 'Võ Văn Khoa',     tenantCccd: '079301090123', rent: 3_000_000, months: 12, signDate: new Date(2025,  6, 15), vehicles: 3 } },
    { name: 'P.302', rent: 3_000_000, status: 'OCCUPIED',      contract: { tenantName: 'Thái Thị Hằng',   tenantCccd: '079401023456', rent: 3_000_000, months: 12, signDate: new Date(2025,  9, 15), vehicles: 1 } },
    { name: 'P.303', rent: 3_000_000, status: 'OCCUPIED',      contract: { tenantName: 'Đỗ Văn Phúc',     tenantCccd: '079501034567', rent: 3_000_000, months: 12, signDate: new Date(2026,  4,  1), vehicles: 1 } },
    { name: 'P.304', rent: 3_000_000, status: 'VACANT' },
    { name: 'P.305', rent: 3_000_000, status: 'OCCUPIED',      contract: { tenantName: 'Kiều Thị Hà',     tenantCccd: '079601045678', rent: 3_000_000, months: 12, signDate: new Date(2025,  5, 20), vehicles: 1 } },
    { name: 'P.401', rent: 3_200_000, status: 'OCCUPIED',      contract: { tenantName: 'Triệu Văn Phú',   tenantCccd: '079701056789', rent: 3_200_000, months: 12, signDate: new Date(2026,  3, 15), vehicles: 1 } },
    { name: 'P.402', rent: 3_200_000, status: 'OCCUPIED',      contract: { tenantName: 'Âu Thị Diễm',     tenantCccd: '079801067890', rent: 3_200_000, months: 12, signDate: new Date(2025,  7, 15), vehicles: 2 } },
    { name: 'P.403', rent: 3_200_000, status: 'OCCUPIED',      contract: { tenantName: 'Tăng Văn Bình',   tenantCccd: '079901089012', rent: 3_200_000, months: 12, signDate: new Date(2025, 11, 15), vehicles: 1 } },
    { name: 'P.404', rent: 3_200_000, status: 'EXPIRING_SOON', contract: { tenantName: 'Lục Thị Loan',    tenantCccd: '079101090123', rent: 3_200_000, months: 12, signDate: new Date(2025,  4, 12), vehicles: 1 } },
  ],
  'Toà C': [
    { name: 'P.101', rent: 2_200_000, status: 'OCCUPIED',      contract: { tenantName: 'Lưu Thị Kim',     tenantCccd: '079201001234', rent: 2_200_000, months: 12, signDate: new Date(2025,  7, 15), vehicles: 1 } },
    { name: 'P.102', rent: 2_200_000, status: 'VACANT' },
    { name: 'P.103', rent: 2_200_000, status: 'VACANT' },
    { name: 'P.104', rent: 2_200_000, status: 'OCCUPIED',      contract: { tenantName: 'Tề Văn Sáng',     tenantCccd: '079301012345', rent: 2_200_000, months: 12, signDate: new Date(2025,  9, 15), vehicles: 2 } },
    { name: 'P.201', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Ninh Văn Đạt',    tenantCccd: '079401034567', rent: 2_500_000, months: 12, signDate: new Date(2025, 10, 15), vehicles: 1 } },
    { name: 'P.202', rent: 2_500_000, status: 'EXPIRING_SOON', contract: { tenantName: 'Trịnh Thị Phương',tenantCccd: '079501045678', rent: 2_500_000, months: 12, signDate: new Date(2025,  4, 28), vehicles: 1 } },
    { name: 'P.203', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Quách Văn Toàn',  tenantCccd: '079601056789', rent: 2_500_000, months: 12, signDate: new Date(2026,  1, 15), vehicles: 2 } },
    { name: 'P.204', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Diệp Thị Xuân',   tenantCccd: '079701078901', rent: 2_500_000, months: 12, signDate: new Date(2025,  8, 15), vehicles: 1 } },
    { name: 'P.205', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Hà Văn Dũng',     tenantCccd: '079801089012', rent: 2_500_000, months: 12, signDate: new Date(2026,  5, 15), vehicles: 1 } },
    { name: 'P.301', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'La Thị Dung',     tenantCccd: '079901090123', rent: 2_800_000, months: 12, signDate: new Date(2025,  8, 15), vehicles: 1 } },
    { name: 'P.302', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Ôn Văn Bình',     tenantCccd: '079101001234', rent: 2_800_000, months: 12, signDate: new Date(2026,  0, 15), vehicles: 3 } },
    { name: 'P.303', rent: 2_800_000, status: 'VACANT' },
    { name: 'P.304', rent: 2_800_000, status: 'OCCUPIED',      contract: { tenantName: 'Liêu Thị Phúc',   tenantCccd: '079201034567', rent: 2_800_000, months: 12, signDate: new Date(2026,  2, 15), vehicles: 1 } },
  ],
  'Toà D': [
    { name: 'P.101', rent: 2_000_000, status: 'OCCUPIED',      contract: { tenantName: 'Kha Thị Loan',    tenantCccd: '079301045678', rent: 2_000_000, months: 12, signDate: new Date(2025,  6, 15), vehicles: 1 } },
    { name: 'P.102', rent: 2_000_000, status: 'EXPIRING_SOON', contract: { tenantName: 'Mã Văn Sáng',     tenantCccd: '079401056789', rent: 2_000_000, months: 12, signDate: new Date(2025,  5,  4), vehicles: 2 } },
    { name: 'P.103', rent: 2_000_000, status: 'VACANT' },
    { name: 'P.201', rent: 2_200_000, status: 'OCCUPIED',      contract: { tenantName: 'Nhan Thị Xuân',   tenantCccd: '079501078901', rent: 2_200_000, months: 12, signDate: new Date(2025,  9, 15), vehicles: 1 } },
    { name: 'P.202', rent: 2_200_000, status: 'OCCUPIED',      contract: { tenantName: 'Bạch Văn Phong',  tenantCccd: '079601089012', rent: 2_200_000, months: 12, signDate: new Date(2026,  2, 15), vehicles: 1 } },
    { name: 'P.203', rent: 2_200_000, status: 'VACANT' },
    { name: 'P.204', rent: 2_200_000, status: 'OCCUPIED',      contract: { tenantName: 'Cù Thị Thanh',    tenantCccd: '079701090123', rent: 2_200_000, months: 12, signDate: new Date(2025,  7, 15), vehicles: 2 } },
    { name: 'P.301', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Lục Văn Toàn',    tenantCccd: '079801012345', rent: 2_500_000, months: 12, signDate: new Date(2026,  4,  1), vehicles: 1 } },
    { name: 'P.302', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Đàm Thị Hồng',    tenantCccd: '079901023456', rent: 2_500_000, months: 12, signDate: new Date(2025, 11, 15), vehicles: 1 } },
    { name: 'P.303', rent: 2_500_000, status: 'OCCUPIED',      contract: { tenantName: 'Tiêu Văn Nghĩa',  tenantCccd: '079101034567', rent: 2_500_000, months: 12, signDate: new Date(2026,  1, 15), vehicles: 1 } },
  ],
}

// ── Invoice definitions ───────────────────────────────────────────────────────
// Sorted oldest → newest so invoice numbers auto-sequence correctly

const INVOICES: InvoiceSeed[] = [
  // ── T1/2026 ──
  { prop: 'Toà A', room: 'P.101', month: '2026-01', tenantName: 'Nguyễn Văn An',  rentAmount: 2_500_000, elecKwh: 115, elecPrice: 4_000, elecAmt: 460_000, waterM3: 7, waterPrice: 15_000, waterAmt: 105_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_265_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.302', month: '2026-01', tenantName: 'Bùi Thị Mai',     rentAmount: 2_800_000, elecKwh: 78,  elecPrice: 4_000, elecAmt: 312_000, waterM3: 4, waterPrice: 15_000, waterAmt:  60_000, internet: 200_000, service: 50_000, otherFees: [{ label: 'Phí giữ xe', amount: 100_000 }], total: 3_522_000, status: 'PAID' },
  { prop: 'Toà B', room: 'P.101', month: '2026-01', tenantName: 'Hồ Thị Ánh',      rentAmount: 2_500_000, elecKwh: 108, elecPrice: 4_000, elecAmt: 432_000, waterM3: 6, waterPrice: 15_000, waterAmt:  90_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_222_000, status: 'PAID' },
  { prop: 'Toà B', room: 'P.305', month: '2026-01', tenantName: 'Kiều Thị Hà',     rentAmount: 3_000_000, elecKwh: 85,  elecPrice: 4_000, elecAmt: 340_000, waterM3: 5, waterPrice: 15_000, waterAmt:  75_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_615_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.204', month: '2026-01', tenantName: 'Vũ Quang Huy',    rentAmount: 2_800_000, elecKwh: 90,  elecPrice: 4_000, elecAmt: 360_000, waterM3: 5, waterPrice: 15_000, waterAmt:  75_000, internet: 200_000, service: 50_000, otherFees: [{ label: 'Phí giữ xe', amount: 100_000 }], total: 3_585_000, status: 'PAID' },

  // ── T2/2026 ──
  { prop: 'Toà A', room: 'P.101', month: '2026-02', tenantName: 'Nguyễn Văn An',  rentAmount: 2_500_000, elecKwh: 118, elecPrice: 4_000, elecAmt: 472_000, waterM3: 7, waterPrice: 15_000, waterAmt: 105_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_277_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.102', month: '2026-02', tenantName: 'Trần Thị Bình',   rentAmount: 2_500_000, elecKwh: 92,  elecPrice: 4_000, elecAmt: 368_000, waterM3: 5, waterPrice: 15_000, waterAmt:  75_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_143_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.302', month: '2026-02', tenantName: 'Bùi Thị Mai',     rentAmount: 2_800_000, elecKwh: 80,  elecPrice: 4_000, elecAmt: 320_000, waterM3: 4, waterPrice: 15_000, waterAmt:  60_000, internet: 200_000, service: 50_000, otherFees: [{ label: 'Phí giữ xe', amount: 100_000 }], total: 3_530_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.204', month: '2026-02', tenantName: 'Vũ Quang Huy',    rentAmount: 2_800_000, elecKwh: 97,  elecPrice: 4_000, elecAmt: 388_000, waterM3: 5, waterPrice: 15_000, waterAmt:  75_000, internet: 200_000, service: 50_000, otherFees: [{ label: 'Phí giữ xe', amount: 100_000 }], total: 3_613_000, status: 'PAID' },
  { prop: 'Toà B', room: 'P.101', month: '2026-02', tenantName: 'Hồ Thị Ánh',      rentAmount: 2_500_000, elecKwh: 105, elecPrice: 4_000, elecAmt: 420_000, waterM3: 6, waterPrice: 15_000, waterAmt:  90_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_210_000, status: 'PAID' },
  { prop: 'Toà B', room: 'P.305', month: '2026-02', tenantName: 'Kiều Thị Hà',     rentAmount: 3_000_000, elecKwh: 88,  elecPrice: 4_000, elecAmt: 352_000, waterM3: 5, waterPrice: 15_000, waterAmt:  75_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_627_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.203', month: '2026-02', tenantName: 'Hoàng Thị Lan',   rentAmount: 2_800_000, elecKwh: 105, elecPrice: 4_000, elecAmt: 420_000, waterM3: 6, waterPrice: 15_000, waterAmt:  90_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_510_000, status: 'PAID' },

  // ── T3/2026 ──
  { prop: 'Toà A', room: 'P.101', month: '2026-03', tenantName: 'Nguyễn Văn An',  rentAmount: 2_500_000, elecKwh: 125, elecPrice: 4_000, elecAmt: 500_000, waterM3: 8, waterPrice: 15_000, waterAmt: 120_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_320_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.102', month: '2026-03', tenantName: 'Trần Thị Bình',   rentAmount: 2_500_000, elecKwh: 100, elecPrice: 4_000, elecAmt: 400_000, waterM3: 6, waterPrice: 15_000, waterAmt:  90_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_190_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.302', month: '2026-03', tenantName: 'Bùi Thị Mai',     rentAmount: 2_800_000, elecKwh: 88,  elecPrice: 4_000, elecAmt: 352_000, waterM3: 5, waterPrice: 15_000, waterAmt:  75_000, internet: 200_000, service: 50_000, otherFees: [{ label: 'Phí giữ xe', amount: 100_000 }], total: 3_577_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.204', month: '2026-03', tenantName: 'Vũ Quang Huy',    rentAmount: 2_800_000, elecKwh: 103, elecPrice: 4_000, elecAmt: 412_000, waterM3: 6, waterPrice: 15_000, waterAmt:  90_000, internet: 200_000, service: 50_000, otherFees: [{ label: 'Phí giữ xe', amount: 100_000 }], total: 3_652_000, status: 'PAID' },
  { prop: 'Toà B', room: 'P.101', month: '2026-03', tenantName: 'Hồ Thị Ánh',      rentAmount: 2_500_000, elecKwh: 112, elecPrice: 4_000, elecAmt: 448_000, waterM3: 7, waterPrice: 15_000, waterAmt: 105_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_253_000, status: 'PAID' },
  { prop: 'Toà B', room: 'P.305', month: '2026-03', tenantName: 'Kiều Thị Hà',     rentAmount: 3_000_000, elecKwh: 91,  elecPrice: 4_000, elecAmt: 364_000, waterM3: 6, waterPrice: 15_000, waterAmt:  90_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_654_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.203', month: '2026-03', tenantName: 'Hoàng Thị Lan',   rentAmount: 2_800_000, elecKwh: 110, elecPrice: 4_000, elecAmt: 440_000, waterM3: 7, waterPrice: 15_000, waterAmt: 105_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_545_000, status: 'PAID' },
  { prop: 'Toà C', room: 'P.204', month: '2026-03', tenantName: 'Diệp Thị Xuân',   rentAmount: 2_500_000, elecKwh: 80,  elecPrice: 4_000, elecAmt: 320_000, waterM3: 4, waterPrice: 15_000, waterAmt:  60_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_080_000, status: 'PAID' },

  // ── T4/2026 ──
  { prop: 'Toà A', room: 'P.101', month: '2026-04', tenantName: 'Nguyễn Văn An',  rentAmount: 2_500_000, elecKwh: 120, elecPrice: 4_000, elecAmt: 480_000, waterM3: 8, waterPrice: 15_000, waterAmt: 120_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_300_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.302', month: '2026-04', tenantName: 'Bùi Thị Mai',     rentAmount: 2_800_000, elecKwh: 85,  elecPrice: 4_000, elecAmt: 340_000, waterM3: 5, waterPrice: 15_000, waterAmt:  75_000, internet: 200_000, service: 50_000, otherFees: [{ label: 'Phí giữ xe', amount: 100_000 }], total: 3_565_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.204', month: '2026-04', tenantName: 'Vũ Quang Huy',    rentAmount: 2_800_000, elecKwh: 108, elecPrice: 4_000, elecAmt: 432_000, waterM3: 7, waterPrice: 15_000, waterAmt: 105_000, internet: 200_000, service: 50_000, otherFees: [{ label: 'Phí giữ xe', amount: 100_000 }], total: 3_687_000, status: 'PAID' },
  { prop: 'Toà B', room: 'P.305', month: '2026-04', tenantName: 'Kiều Thị Hà',     rentAmount: 3_000_000, elecKwh: 93,  elecPrice: 4_000, elecAmt: 372_000, waterM3: 6, waterPrice: 15_000, waterAmt:  90_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_662_000, status: 'PAID' },
  { prop: 'Toà B', room: 'P.201', month: '2026-04', tenantName: 'Doãn Văn Hùng',   rentAmount: 2_800_000, elecKwh: 78,  elecPrice: 4_000, elecAmt: 312_000, waterM3: 5, waterPrice: 15_000, waterAmt:  75_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_387_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.203', month: '2026-04', tenantName: 'Hoàng Thị Lan',   rentAmount: 2_800_000, elecKwh: 115, elecPrice: 4_000, elecAmt: 460_000, waterM3: 8, waterPrice: 15_000, waterAmt: 120_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_580_000, status: 'PAID' },
  { prop: 'Toà A', room: 'P.102', month: '2026-04', tenantName: 'Trần Thị Bình',   rentAmount: 2_500_000, elecKwh: 95,  elecPrice: 4_000, elecAmt: 380_000, waterM3: 6, waterPrice: 15_000, waterAmt:  90_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_170_000, status: 'ISSUED' },
  { prop: 'Toà B', room: 'P.101', month: '2026-04', tenantName: 'Hồ Thị Ánh',      rentAmount: 2_500_000, elecKwh: 110, elecPrice: 4_000, elecAmt: 440_000, waterM3: 7, waterPrice: 15_000, waterAmt: 105_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_245_000, status: 'ISSUED' },
  { prop: 'Toà C', room: 'P.204', month: '2026-04', tenantName: 'Diệp Thị Xuân',   rentAmount: 2_500_000, elecKwh: 85,  elecPrice: 4_000, elecAmt: 340_000, waterM3: 5, waterPrice: 15_000, waterAmt:  75_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_115_000, status: 'ISSUED' },

  // ── T5/2026 ──
  { prop: 'Toà A', room: 'P.101', month: '2026-05', tenantName: 'Nguyễn Văn An',  rentAmount: 2_500_000, elecKwh: 122, elecPrice: 4_000, elecAmt: 488_000, waterM3: 8, waterPrice: 15_000, waterAmt: 120_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_308_000, status: 'ISSUED' },
  { prop: 'Toà A', room: 'P.102', month: '2026-05', tenantName: 'Trần Thị Bình',   rentAmount: 2_500_000, elecKwh: 98,  elecPrice: 4_000, elecAmt: 392_000, waterM3: 6, waterPrice: 15_000, waterAmt:  90_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_182_000, status: 'ISSUED' },
  { prop: 'Toà A', room: 'P.204', month: '2026-05', tenantName: 'Vũ Quang Huy',    rentAmount: 2_800_000, elecKwh: 100, elecPrice: 4_000, elecAmt: 400_000, waterM3: 6, waterPrice: 15_000, waterAmt:  90_000, internet: 200_000, service: 50_000, otherFees: [{ label: 'Phí giữ xe', amount: 100_000 }], total: 3_640_000, status: 'ISSUED' },
  { prop: 'Toà A', room: 'P.404', month: '2026-05', tenantName: 'Lâm Thị Ngọc',   rentAmount: 3_000_000, elecKwh: 100, elecPrice: 4_000, elecAmt: 400_000, waterM3: 6, waterPrice: 15_000, waterAmt:  90_000, internet: 200_000, service: 50_000, otherFees: [],                                    total: 3_740_000, status: 'ISSUED' },
  { prop: 'Toà A', room: 'P.302', month: '2026-05', tenantName: 'Bùi Thị Mai',     rentAmount: 2_800_000, elecKwh: 87,  elecPrice: 4_000, elecAmt: 348_000, waterM3: 5, waterPrice: 15_000, waterAmt:  75_000, internet: 200_000, service: 50_000, otherFees: [{ label: 'Phí giữ xe', amount: 100_000 }], total: 3_573_000, status: 'DRAFT' },
  { prop: 'Toà A', room: 'P.203', month: '2026-05', tenantName: 'Hoàng Thị Lan',   rentAmount: 2_800_000, elecKwh: 119, elecPrice: 4_000, elecAmt: 476_000, waterM3: 8, waterPrice: 15_000, waterAmt: 120_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_596_000, status: 'DRAFT' },
  { prop: 'Toà B', room: 'P.305', month: '2026-05', tenantName: 'Kiều Thị Hà',     rentAmount: 3_000_000, elecKwh: 90,  elecPrice: 4_000, elecAmt: 360_000, waterM3: 6, waterPrice: 15_000, waterAmt:  90_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_650_000, status: 'ISSUED' },
  { prop: 'Toà B', room: 'P.103', month: '2026-05', tenantName: 'Chu Thị Nga',     rentAmount: 2_500_000, elecKwh: 90,  elecPrice: 4_000, elecAmt: 360_000, waterM3: 5, waterPrice: 15_000, waterAmt:  75_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_135_000, status: 'ISSUED' },
  { prop: 'Toà B', room: 'P.101', month: '2026-05', tenantName: 'Hồ Thị Ánh',      rentAmount: 2_500_000, elecKwh: 108, elecPrice: 4_000, elecAmt: 432_000, waterM3: 7, waterPrice: 15_000, waterAmt: 105_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_237_000, status: 'DRAFT' },
  { prop: 'Toà B', room: 'P.201', month: '2026-05', tenantName: 'Doãn Văn Hùng',   rentAmount: 2_800_000, elecKwh: 82,  elecPrice: 4_000, elecAmt: 328_000, waterM3: 5, waterPrice: 15_000, waterAmt:  75_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_203_000, status: 'DRAFT' },
  { prop: 'Toà C', room: 'P.204', month: '2026-05', tenantName: 'Diệp Thị Xuân',   rentAmount: 2_500_000, elecKwh: 85,  elecPrice: 4_000, elecAmt: 340_000, waterM3: 4, waterPrice: 15_000, waterAmt:  60_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 3_100_000, status: 'ISSUED' },
  { prop: 'Toà D', room: 'P.204', month: '2026-05', tenantName: 'Cù Thị Thanh',    rentAmount: 2_200_000, elecKwh: 70,  elecPrice: 4_000, elecAmt: 280_000, waterM3: 4, waterPrice: 15_000, waterAmt:  60_000, internet: 200_000, service: 0,      otherFees: [],                                    total: 2_740_000, status: 'ISSUED' },
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🧹 Cleaning up old data...')
  await prisma.transaction.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.contract.deleteMany()
  await prisma.tenant.deleteMany()
  await prisma.room.deleteMany()
  await prisma.property.deleteMany()

  console.log('👤 Upserting dev user...')
  await prisma.user.upsert({
    where: { id: 'user-1' },
    update: {},
    create: { id: 'user-1', email: 'admin@quanlynha.vn', passwordHash: 'dev-only' },
  })

  console.log('🏢 Creating properties & rooms...')

  const PROPERTY_DEFS = [
    { name: 'Toà A', address: '45 Lê Văn Lương, Q. Tân Bình',       floors: 4, totalRooms: 22, contractMonths: 12, contractStart: new Date(2024, 2, 1),  baseRent: 12_200_000 },
    { name: 'Toà B', address: '12 Nguyễn Trãi, Q. 5',               floors: 3, totalRooms: 18, contractMonths:  6, contractStart: new Date(2024, 5, 15), baseRent: 10_800_000 },
    { name: 'Toà C', address: '78 Võ Văn Tần, Q. 3',                 floors: 3, totalRooms: 13, contractMonths: 12, contractStart: new Date(2025, 0, 1),  baseRent:  6_800_000 },
    { name: 'Toà D', address: '33 Điện Biên Phủ, Q. Bình Thạnh',     floors: 2, totalRooms: 10, contractMonths:  6, contractStart: new Date(2024, 8, 10), baseRent:  3_500_000 },
  ]

  // roomId lookup: "Toà A|P.101" → dbId
  const roomIdMap: Record<string, string> = {}
  // contractId lookup: "Toà A|P.101" → dbId
  const contractIdMap: Record<string, string> = {}

  for (const propDef of PROPERTY_DEFS) {
    const prop = await prisma.property.create({
      data: {
        userId: 'user-1',
        name: propDef.name,
        address: propDef.address,
        floors: propDef.floors,
        totalRooms: propDef.totalRooms,
        contractMonths: propDef.contractMonths,
        contractStart: propDef.contractStart,
        baseRent: propDef.baseRent,
        photos: [],
      },
    })

    const roomSeeds = ROOMS[propDef.name] ?? []
    for (const rs of roomSeeds) {
      const room = await prisma.room.create({
        data: {
          propertyId: prop.id,
          name: rs.name,
          rent: rs.contract?.rent ?? rs.rent,
          status: rs.status,
        },
      })
      roomIdMap[`${propDef.name}|${rs.name}`] = room.id

      if (rs.contract) {
        const { tenantName, tenantCccd, rent, months, signDate, vehicles } = rs.contract
        const tenant = await prisma.tenant.create({
          data: { name: tenantName, cccd: tenantCccd },
        })
        const endDate = addMonths(signDate, months)
        const contractStatus = endDate > new Date() ? 'ACTIVE' : 'EXPIRED'
        const contract = await prisma.contract.create({
          data: {
            roomId: room.id,
            tenantId: tenant.id,
            rent,
            months,
            signDate,
            endDate,
            status: contractStatus,
            vehicles,
          },
        })
        contractIdMap[`${propDef.name}|${rs.name}`] = contract.id
      }
    }
    console.log(`  ✅ ${propDef.name}: ${roomSeeds.length} phòng`)
  }

  console.log('🧾 Creating invoices...')
  let invSeq = 1
  for (const inv of INVOICES) {
    const roomId = roomIdMap[`${inv.prop}|${inv.room}`]
    if (!roomId) {
      console.warn(`  ⚠️  Room not found: ${inv.prop} | ${inv.room}`)
      continue
    }
    const contractId = contractIdMap[`${inv.prop}|${inv.room}`]
    const invoiceNumber = `INV-${inv.month.replace('-', '')}-${String(invSeq++).padStart(3, '0')}`
    const now = new Date()

    const created = await prisma.invoice.create({
      data: {
        invoiceNumber,
        month: inv.month,
        roomId,
        contractId,
        tenantName: inv.tenantName,
        rentAmount: inv.rentAmount,
        electricKwh: inv.elecKwh,
        electricPrice: inv.elecPrice,
        electricAmount: inv.elecAmt,
        waterM3: inv.waterM3,
        waterPrice: inv.waterPrice,
        waterAmount: inv.waterAmt,
        internetAmount: inv.internet,
        serviceAmount: inv.service,
        otherFees: inv.otherFees,
        totalAmount: inv.total,
        note: '',
        status: inv.status,
        issuedAt: inv.status !== 'DRAFT' ? now : null,
        paidAt:   inv.status === 'PAID'  ? now : null,
      },
    })

    if (inv.status === 'PAID') {
      await prisma.transaction.create({
        data: {
          type: 'INCOME',
          category: 'RENT',
          amount: inv.total,
          date: now,
          note: `Thu tiền hoá đơn ${invoiceNumber}`,
          roomId,
          contractId: contractId ?? null,
          invoiceId: created.id,
        },
      })
    }
  }
  console.log(`  ✅ ${INVOICES.length} hoá đơn`)

  // Summary
  const [propCount, roomCount, contractCount, invoiceCount, txCount] = await Promise.all([
    prisma.property.count(),
    prisma.room.count(),
    prisma.contract.count(),
    prisma.invoice.count(),
    prisma.transaction.count(),
  ])
  console.log('\n🎉 Seed hoàn thành!')
  console.log(`   ${propCount} toà nhà | ${roomCount} phòng | ${contractCount} hợp đồng | ${invoiceCount} hoá đơn | ${txCount} giao dịch`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
