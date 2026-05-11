import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tx = await prisma.transaction.deleteMany({});
  console.log(`Transaction: ${tx.count}`);

  const inv = await prisma.invoice.deleteMany({});
  console.log(`Invoice: ${inv.count}`);

  const ct = await prisma.contract.deleteMany({});
  console.log(`Contract: ${ct.count}`);

  const tn = await prisma.tenant.deleteMany({});
  console.log(`Tenant: ${tn.count}`);

  const prop = await prisma.property.deleteMany({});
  console.log(`Property (cascade Room): ${prop.count}`);

  const rooms = await prisma.room.count();
  console.log(`Room còn lại: ${rooms}`);

  console.log("✅ Xong – database sạch, User giữ nguyên");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
