import { Module } from "@nestjs/common";
import { WarehouseDwhScheduler } from "../../schedulers/warehouse-dwh.scheduler";
import { ItemsDwhScheduler } from "../../schedulers/items-dwh.scheduler";
import { SalesTransactionsDwhScheduler } from "../../schedulers/sales-transactions-dwh.scheduler";
import { WarehousesModule } from "../warehouses/warehouses.module";
import { ItemsModule } from "../items/items.module";
import { TransactionsModule } from "../transactions/transactions.module";
import { SalesBudgetTransactionsDwhScheduler } from "src/schedulers/sales-budget-transactions-dwh.scheduler";

@Module({
  imports: [WarehousesModule, ItemsModule, TransactionsModule],
  providers: [
    WarehouseDwhScheduler,
    ItemsDwhScheduler,
    SalesTransactionsDwhScheduler,
    SalesBudgetTransactionsDwhScheduler,
  ],
  exports: [
    WarehouseDwhScheduler,
    ItemsDwhScheduler,
    SalesTransactionsDwhScheduler,
    SalesBudgetTransactionsDwhScheduler,
  ],
})
export class SchedulersModule {}
