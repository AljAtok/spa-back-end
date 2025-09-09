import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  UploadedFile,
  BadRequestException,
  UseInterceptors,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { PermissionsGuard } from "../guards/permissions.guard";
import { RequirePermissions } from "../decorators/permissions.decorator";
import { WarehouseHurdlesService } from "../services/warehouse-hurdles.service";
import { CreateWarehouseHurdleDto } from "../dto/CreateWarehouseHurdleDto";
import { UpdateWarehouseHurdleDto } from "../dto/UpdateWarehouseHurdleDto";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from "xlsx";
import { diskStorage } from "multer";
import * as fs from "fs";
import { extname } from "path";
import { UserAuditTrailCreateService } from "../services/user-audit-trail-create.service";
import { CreateUserAuditTrailDto } from "../dto/CreateUserAuditTrailDto";
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

@Controller("warehouse-hurdles")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WarehouseHurdlesController {
  constructor(
    private readonly warehouseHurdlesService: WarehouseHurdlesService,
    private readonly auditTrailService: UserAuditTrailCreateService
  ) {}

  @Get()
  // @RequirePermissions({ module: "STORE HURDLES", action: "VIEW" })
  async findAll(@Request() req) {
    const accessKeyId = req.user.current_access_key;
    const userId = req.user.id;
    const roleId = req.user.role_id;
    return this.warehouseHurdlesService.findAll(accessKeyId, userId, roleId);
  }

  @Get("history/:id")
  @RequirePermissions({ module: "STORE HURDLES", action: "VIEW" })
  async findOneHistory(@Param("id", ParseIntPipe) id: number) {
    return this.warehouseHurdlesService.findOneHistory(id);
  }

  @Get(":id")
  @RequirePermissions({ module: "STORE HURDLES", action: "VIEW" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.warehouseHurdlesService.findOne(id);
  }

  @Post()
  @RequirePermissions({ module: "STORE HURDLES", action: "ADD" })
  async create(@Body() createDto: CreateWarehouseHurdleDto, @Request() req) {
    const userId = req.user.id;
    return this.warehouseHurdlesService.create(createDto, userId);
  }

  @Put(":id")
  @RequirePermissions({ module: "STORE HURDLES", action: "EDIT" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateWarehouseHurdleDto,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.warehouseHurdlesService.update(id, updateDto, userId);
  }

  @Delete(":id")
  @RequirePermissions({ module: "STORE HURDLES", action: "CANCEL" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.warehouseHurdlesService.remove(id);
  }

  @Post("/change-bulk-status")
  @RequirePermissions({ module: "STORE HURDLES", action: "ADD" })
  async toggleBulkStatus(
    @Body() body: { ids: number[]; status_id: number; undo_reason?: string },
    @Request() req
  ) {
    const userId = req.user.id;
    const { ids, status_id, undo_reason } = body;
    if (!Array.isArray(ids) || typeof status_id !== "number") {
      throw new BadRequestException(
        "Invalid payload: ids and status_id are required."
      );
    }
    return this.warehouseHurdlesService.toggleBulkStatus(
      ids,
      status_id,
      userId,
      undo_reason
    );
  }

  @Patch(":id/toggle-status-approved")
  @RequirePermissions({ module: "STORE HURDLES", action: "APPROVE" })
  async toggleStatusApproved(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ) {
    const userId = req.user.id;
    const status_id = 7; // Approved status
    return this.warehouseHurdlesService.toggleStatus(id, userId, status_id);
  }

  @Patch(":id/toggle-status-back-to-pending")
  @RequirePermissions({ module: "STORE HURDLES", action: "ACTIVATE" })
  async toggleStatusBackToPending(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: any, // Assuming body may contain undo_reason
    @Request() req
  ) {
    const userId = req.user.id;
    const status_id = 3; // Pending status
    const undo_reason = body.undo_reason || null;
    return this.warehouseHurdlesService.toggleStatus(
      id,
      userId,
      status_id,
      undo_reason
    );
  }

  @Patch(":id/toggle-status-for-approval")
  @RequirePermissions({ module: "STORE HURDLES", action: "EDIT" })
  async toggleStatusForApproval(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ) {
    const userId = req.user.id;
    const status_id = 6; // For Approval status
    return this.warehouseHurdlesService.toggleStatus(id, userId, status_id);
  }

  @Patch(":id/toggle-status-activate")
  @RequirePermissions({ module: "STORE HURDLES", action: "ACTIVATE" })
  async toggleStatusActivate(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ) {
    const userId = req.user.id;
    const status_id = 2; // Active status
    return this.warehouseHurdlesService.toggleStatus(id, userId, status_id);
  }

  @Patch(":id/toggle-status-deactivate")
  @RequirePermissions({ module: "STORE HURDLES", action: "DEACTIVATE" })
  async toggleStatusDeactivate(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: any,
    @Request() req
  ) {
    const userId = req.user.id;
    const status_id = 2; // Inactive status
    return this.warehouseHurdlesService.toggleStatus(id, userId, status_id);
  }

  @Post("upload-excel")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/warehouse-hurdles",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return cb(
            new BadRequestException("Only Excel files are allowed!"),
            false
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 8 * 1024 * 1024 },
    })
  )
  async uploadExcel(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException("No file uploaded or invalid file type.");
    }
    const workbook = XLSX.read(fs.readFileSync(file.path), { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });
    const userId = req.user.id;
    const roleId = req.user.role_id;
    // Get allowed location_ids for this user/role
    const userLocations = await this.warehouseHurdlesService.getUserLocationIds(
      userId,
      roleId
    );
    const allowedLocationIds = userLocations.map((ul) => ul.location_id);
    // Map Excel columns to DTOs
    const records = json.map((row) => {
      let hurdle_date = null;
      const excelDate = row["HURDLE MONTH"];
      let year, month;
      if (typeof excelDate === "number") {
        // Excel serial date
        const parsed = XLSX.SSF.parse_date_code(excelDate);
        if (parsed) {
          year = parsed.y;
          month = String(parsed.m).padStart(2, "0");
        }
      } else if (typeof excelDate === "string" && excelDate) {
        // Use dayjs UTC for robust parsing
        const d = dayjs.utc(excelDate);
        if (d.isValid()) {
          year = d.year();
          month = String(d.month() + 1).padStart(2, "0");
        }
      }
      if (year && month) {
        hurdle_date = `${year}-${month}-01`;
      }
      return {
        ss_hurdle_qty:
          row["HURDLE QTY"] !== null && row["HURDLE QTY"] !== undefined
            ? Number(row["HURDLE QTY"])
            : null,
        hurdle_date,
        warehouse_ifs: row["STORE IFS"],
        item_category_code: row["ITEM CATEGORY CODE"],
      };
    });
    // Audit trail
    await this.auditTrailService.create(
      {
        service: "WarehouseHurdlesController",
        method: "uploadExcel",
        raw_data: JSON.stringify(records).slice(0, 65535), // TEXT max length in MySQL is 65,535 bytes
        description: `Bulk upload warehouse hurdles from Excel. Rows: ${records.length}`,
        status_id: 1,
      },
      userId
    );
    return this.warehouseHurdlesService.bulkUploadFromExcel(
      records,
      userId,
      allowedLocationIds
    );
  }
}
