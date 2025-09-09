import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsController } from "../../controllers/transactions.controller";
import { SalesTransactionsController } from "../../controllers/sales-transactions.controller";
import { SalesTransactionsDwhController } from "../../controllers/sales-transactions-dwh.controller";
import { SalesBudgetTransactionsController } from "../../controllers/sales-budget-transactions.controller";
import { SalesBudgetTransactionsDwhController } from "../../controllers/sales-budget-transactions-dwh.controller";
import { TransactionsService } from "../../services/transactions.service";
import { SalesTransactionsService } from "../../services/sales-transactions.service";
import { SalesTransactionsDwhService } from "../../services/sales-transactions-dwh.service";
import { SalesBudgetTransactionsService } from "../../services/sales-budget-transactions.service";
import { SalesBudgetTransactionsDwhService } from "../../services/sales-budget-transactions-dwh.service";
import { TransactionHeader } from "../../entities/TransactionHeader";
import { TransactionDetail } from "../../entities/TransactionDetail";
import { SalesTransaction } from "../../entities/SalesTransaction";
import { SalesBudgetTransaction } from "../../entities/SalesBudgetTransaction";
import { UsersModule } from "../users/users.module";
import { LocationsModule } from "../locations/locations.module";
import { UserAuditTrailModule } from "../users/user-audit-trail.module";
import { DwhLog } from "src/entities/dwhLog";
import { UserPermissions } from "src/entities/UserPermissions";
import { Module as AppModule } from "../../entities/Module";
import { Action } from "src/entities/Action";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionHeader,
      TransactionDetail,
      SalesTransaction,
      SalesBudgetTransaction,
      DwhLog,
      UserPermissions,
      AppModule,
      Action,
    ]),
    UsersModule,
    LocationsModule,
    UserAuditTrailModule,
  ],
  controllers: [
    TransactionsController,
    SalesTransactionsController,
    SalesBudgetTransactionsController,
    SalesTransactionsDwhController,
    SalesBudgetTransactionsDwhController,
  ],
  providers: [
    TransactionsService,
    SalesTransactionsService,
    SalesTransactionsDwhService,
    SalesBudgetTransactionsService,
    SalesBudgetTransactionsDwhService,
  ],
  exports: [
    TransactionsService,
    SalesTransactionsService,
    SalesTransactionsDwhService,
    SalesBudgetTransactionsService,
    SalesBudgetTransactionsDwhService,
  ],
})
export class TransactionsModule {}
