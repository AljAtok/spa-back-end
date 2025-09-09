import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { TransactionsService } from "../services/transactions.service";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/guards/permissions.guard";
import { RequirePermissions } from "src/decorators/permissions.decorator";

@Controller("dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly service: TransactionsService) {}

  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: "DASHBOARD", action: "VIEW" })
  @Get()
  async getTransactionDashboard(
    @Query("location_ids") location_ids?: string,
    @Query("trans_date") trans_date?: string,
    @Query("warehouse_id") warehouse_id?: number,
    @Query("status_id") status_id?: number,
    @Req() req?: any
  ) {
    // Parse location_ids as array of numbers if provided
    let locationIdsArr: number[] | undefined = undefined;
    if (location_ids) {
      locationIdsArr = location_ids
        .split(",")
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));
    }
    const user = req?.user || {};
    return this.service.generateTransactionReport({
      location_ids: locationIdsArr,
      trans_date,
      warehouse_id: warehouse_id ? Number(warehouse_id) : undefined,
      status_id: status_id ? Number(status_id) : undefined,
      user_id: user.id,
      role_id: user.role_id,
      current_access_key: user.current_access_key,
    });
  }
}
