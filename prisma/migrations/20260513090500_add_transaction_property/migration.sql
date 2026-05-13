-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "propertyId" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_propertyId_fkey"
FOREIGN KEY ("propertyId") REFERENCES "Property"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
