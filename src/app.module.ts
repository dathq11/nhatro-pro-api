import { Module } from '@nestjs/common'
import { PrismaModule } from './prisma/prisma.module'
import { PropertiesModule } from './properties/properties.module'
import { RoomsModule } from './rooms/rooms.module'
import { TenantsModule } from './tenants/tenants.module'
import { ContractsModule } from './contracts/contracts.module'
import { InvoicesModule } from './invoices/invoices.module'
import { TransactionsModule } from './transactions/transactions.module'

@Module({
  imports: [
    PrismaModule,
    PropertiesModule,
    RoomsModule,
    TenantsModule,
    ContractsModule,
    InvoicesModule,
    TransactionsModule,
  ],
})
export class AppModule {}
