import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Put,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { PermissionsGuard } from "../guards/permissions.guard";
import { DynamicPermissionsGuard } from "../guards/dynamic-permissions.guard";
import { RequirePermissions } from "../decorators/permissions.decorator";
import { LocationsService } from "../services/locations.service";
import { CreateLocationDto } from "src/dto/CreateLocationDto";
import { UpdateLocationDto } from "src/dto/UpdateLocationDto";

@Controller("locations")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @RequirePermissions({ module: "LOCATIONS", action: "DATA ACCESS" })
  async findAll(@Request() req) {
    const userId = req.user?.id;
    const roleId = req.user?.role_id;
    return this.locationsService.findAll(userId, roleId);
  }

  @Get(":id")
  @RequirePermissions({ module: "LOCATIONS", action: "VIEW" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.locationsService.findOne(id);
  }

  @Post()
  @RequirePermissions({ module: "LOCATIONS", action: "ADD" })
  async create(@Body() createLocationDto: CreateLocationDto, @Request() req) {
    const userId = req.user.id;
    return this.locationsService.create(createLocationDto, userId);
  }

  @Put(":id")
  @RequirePermissions({ module: "LOCATIONS", action: "EDIT" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.locationsService.update(id, updateLocationDto, userId);
  }

  @Delete(":id")
  @RequirePermissions({ module: "LOCATIONS", action: "CANCEL" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.locationsService.remove(id);
  }

  @Patch(":id/toggle-status-activate")
  // @UseGuards(JwtAuthGuard, DynamicPermissionsGuard)
  @RequirePermissions({ module: "LOCATIONS", action: "ACTIVATE" })
  async toggleStatusActivate(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.locationsService.toggleStatus(id, userId);
  }

  @Patch(":id/toggle-status-deactivate")
  @RequirePermissions({ module: "LOCATIONS", action: "DEACTIVATE" })
  async toggleStatusDeactivate(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.locationsService.toggleStatus(id, userId);
  }
}
