import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Patch,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { PermissionsGuard } from "../guards/permissions.guard";
import { RequirePermissions } from "../decorators/permissions.decorator";
import { WarehousesService } from "../services/warehouses.service";
import { CreateWarehouseDto } from "../dto/CreateWarehouseDto";
import { UpdateWarehouseDto } from "../dto/UpdateWarehouseDto";

@Controller("warehouses")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get("/stores/:warehouse_type_id")
  @RequirePermissions({ module: "LOCATIONS", action: "VIEW" })
  async findAll(
    @Param("warehouse_type_id", ParseIntPipe) warehouseTypeId: number,
    @Request() req
  ) {
    const accessKeyId = req.user.current_access_key;
    const userId = req.user?.id;
    const roleId = req.user?.role_id;
    return this.warehousesService.findAll(
      warehouseTypeId,
      accessKeyId,
      userId,
      roleId
    );
  }

  @Get(":id")
  @RequirePermissions({ module: "WAREHOUSES", action: "VIEW" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.warehousesService.findOne(id);
  }

  @Post()
  @RequirePermissions({ module: "WAREHOUSES", action: "ADD" })
  async create(@Body() createDto: CreateWarehouseDto, @Request() req) {
    const userId = req.user.id;
    const accessKeyId = req.user.current_access_key;
    return this.warehousesService.create(
      { ...createDto, access_key_id: accessKeyId },
      userId
    );
  }

  @Put(":id")
  @RequirePermissions({ module: "WAREHOUSES", action: "EDIT" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateWarehouseDto,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.warehousesService.update(id, updateDto, userId);
  }

  @Delete(":id")
  @RequirePermissions({ module: "WAREHOUSES", action: "CANCEL" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.warehousesService.remove(id);
  }

  @Patch(":id/toggle-status-activate")
  @RequirePermissions({ module: "WAREHOUSES", action: "ACTIVATE" })
  async toggleStatusActivate(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.warehousesService.toggleStatus(id, userId);
  }

  @Patch(":id/toggle-status-deactivate")
  @RequirePermissions({ module: "WAREHOUSES", action: "DEACTIVATE" })
  async toggleStatusDeactivate(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.warehousesService.toggleStatus(id, userId);
  }
}
