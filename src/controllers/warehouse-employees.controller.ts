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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { PermissionsGuard } from "../guards/permissions.guard";
import { RequirePermissions } from "../decorators/permissions.decorator";
import { WarehouseEmployeesService } from "../services/warehouse-employees.service";
import { CreateWarehouseEmployeeDto } from "../dto/CreateWarehouseEmployeeDto";
import { UpdateWarehouseEmployeeDto } from "../dto/UpdateWarehouseEmployeeDto";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from "xlsx";
import { diskStorage } from "multer";
import { extname } from "path";
import { WarehousesService } from "../services/warehouses.service";
import { EmployeesService } from "../services/employees.service";
import { StatusService } from "../services/status.service";
import { Request as ExpressRequest } from "express";
import { Multer } from "multer";
import * as fs from "fs";
import { UserAuditTrailCreateService } from "../services/user-audit-trail-create.service";

@Controller("warehouse-employees")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WarehouseEmployeesController {
  constructor(
    private readonly warehouseEmployeesService: WarehouseEmployeesService,
    private readonly warehousesService: WarehousesService,
    private readonly employeesService: EmployeesService,
    private readonly statusService: StatusService,
    private readonly userAuditTrailCreateService: UserAuditTrailCreateService // Inject audit trail service
  ) {}

  @Get()
  @RequirePermissions({ module: "STORE_EMPLOYEES", action: "VIEW" })
  async findAll(@Request() req) {
    const accessKeyId = req.user.current_access_key;
    const userId = req.user.id;
    const roleId = req.user.role_id;
    return this.warehouseEmployeesService.findAll(accessKeyId, userId, roleId);
  }

  @Get(":id")
  @RequirePermissions({ module: "STORE_EMPLOYEES", action: "VIEW" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.warehouseEmployeesService.findOne(id);
  }

  @Post()
  @RequirePermissions({ module: "STORE_EMPLOYEES", action: "ADD" })
  async create(@Body() createDto: CreateWarehouseEmployeeDto, @Request() req) {
    const userId = req.user.id;
    const accessKeyId = req.user.current_access_key;
    return this.warehouseEmployeesService.create(
      { ...createDto, access_key_id: accessKeyId },
      userId
    );
  }

  @Put(":id")
  @RequirePermissions({ module: "STORE_EMPLOYEES", action: "EDIT" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateWarehouseEmployeeDto,
    @Request() req
  ) {
    const userId = req.user.id;
    const accessKeyId = req.user.current_access_key;
    return this.warehouseEmployeesService.update(
      id,
      { ...updateDto, access_key_id: accessKeyId },
      userId
    );
  }

  @Delete(":id")
  @RequirePermissions({ module: "STORE_EMPLOYEES", action: "CANCEL" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.warehouseEmployeesService.remove(id);
  }

  @Patch(":id/toggle-status-activate")
  @RequirePermissions({ module: "STORE_EMPLOYEES", action: "ACTIVATE" })
  async toggleStatusActivate(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.warehouseEmployeesService.toggleStatus(id, userId);
  }

  @Patch(":id/toggle-status-deactivate")
  @RequirePermissions({ module: "STORE_EMPLOYEES", action: "DEACTIVATE" })
  async toggleStatusDeactivate(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ) {
    const userId = req.user.id;
    return this.warehouseEmployeesService.toggleStatus(id, userId);
  }

  @Post("upload")
  @RequirePermissions({ module: "STORE_EMPLOYEES", action: "ADD" })
  async bulkUpload(
    @Body() records: CreateWarehouseEmployeeDto[],
    @Request() req
  ) {
    const userId = req.user.id;
    const accessKeyId = req.user.current_access_key;
    return this.warehouseEmployeesService.bulkUpload(
      records,
      userId,
      accessKeyId,
      {
        batchSize: 100,
      }
    );
  }

  @Post("upload-excel")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/warehouse-emp",
        filename: fileName,
      }),
      fileFilter: excelFileFilter,
      limits: { fileSize: 8 * 1024 * 1024 }, // 8MB limit
    })
  )
  @RequirePermissions({ module: "STORE_EMPLOYEES", action: "ADD" })
  async uploadExcel(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException("No file uploaded or invalid file type.");
    }
    // Use disk storage: read from file.path
    const workbook = XLSX.read(fs.readFileSync(file.path), { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

    const userId = req.user.id;
    const roleId = req.user.role_id;
    // Get allowed location_ids for this user/role
    const userLocations =
      await this.warehouseEmployeesService.getUserLocationIds(userId, roleId);
    const allowedLocationIds = userLocations.map((ul) => ul.location_id);

    // Preload all warehouses, employees (with their locations), and statuses for fast lookup
    const warehouses = await this.warehousesService.findAll();
    const employees = await this.employeesService.findAll(
      undefined,
      userId,
      roleId
    ); // Pass parameters to include locations
    const statuses = await this.statusService.findAll();

    const records: CreateWarehouseEmployeeDto[] = [];
    const errors: { row: number; error: string }[] = [];
    const rowMap: { row: number; record: any }[] = [];

    for (let i = 0; i < json.length; i++) {
      const row = json[i];
      const excelRowNum = i + 2; // +2 for Excel row number (header + 1-based)
      try {
        // 1. Warehouse lookup
        const warehouse = warehouses.find(
          (w) => w.warehouse_ifs == row["STORE IFS"] && w.status_id === 1
        );
        if (!warehouse) throw new Error("Invalid or inactive STORE IFS");
        // Location permission check
        if (!allowedLocationIds.includes(warehouse.location_id)) {
          throw new Error(
            `You do not have permission to upload employees for STORE IFS ${row["STORE IFS"]} (${warehouse.warehouse_name}), location_id ${warehouse.location_id}.`
          );
        }

        // 2. Employee lookups
        interface Employee {
          id: number;
          employee_number: string;
          status_id: number;
          position_abbr?: string;
          position_name?: string;
          locations?: { location_id: number; location_name: string }[]; // Updated to match the structure returned by the service
        }
        // General employee finder - updated to use employee_locations many-to-many relationship
        const findEmp = (
          empNo: string,
          abbrs: string[],
          opts?: { requireLocationId?: boolean }
        ): Employee | undefined =>
          employees.find((e: any) => {
            const matchesEmpNo = e.employee_number == empNo;
            const matchesStatus = e.status_id === 1;
            const matchesAbbr = abbrs.includes(
              (e.position_abbr || e.position_name || "").toUpperCase()
            );

            // Check if employee is assigned to the warehouse location through employee_locations
            const matchesLocation =
              !opts?.requireLocationId ||
              (e.locations &&
                Array.isArray(e.locations) &&
                e.locations.some(
                  (loc) => loc.location_id === warehouse.location_id
                ));

            return (
              matchesEmpNo && matchesStatus && matchesAbbr && matchesLocation
            );
          });

        // SS (must be assigned to this warehouse's location via employee_locations)
        const ss = findEmp(
          row["ASSIGNED SS EMP. NO."],
          ["SS", "AH", "BCH", "RH"],
          {
            requireLocationId: true,
          }
        );
        if (!ss)
          throw new Error(
            `Invalid ASSIGNED SS EMP. NO. [${row["ASSIGNED SS EMP. NO."]}] (not found or not assigned to this warehouse's location)`
          );

        // AH (must be assigned to this warehouse's location via employee_locations)
        const ah = findEmp(row["ASSIGNED AH EMP. NO."], ["AH", "BCH", "RH"], {
          requireLocationId: true,
        });
        if (!ah)
          throw new Error(
            `Invalid ASSIGNED AH EMP. NO. [${row["ASSIGNED AH EMP. NO."]}] (not found or not assigned to this warehouse's location)`
          );

        // BCH
        // BCH (nullable)
        let bch = null;
        if (row["ASSIGNED BCH EMP. NO."]) {
          const foundBch = findEmp(row["ASSIGNED BCH EMP. NO."], [
            "AH",
            "BCH",
            "RH",
          ]);
          if (!foundBch)
            throw new Error(
              `Invalid ASSIGNED BCH EMP. NO. [${row["ASSIGNED BCH EMP. NO."]}]`
            );
          bch = foundBch ? foundBch.id : null;
        }

        // GBCH (nullable)
        let gbch = null;
        if (row["ASSIGNED GBCH EMP. NO."]) {
          const foundGbch = findEmp(row["ASSIGNED GBCH EMP. NO."], [
            "AH",
            "BCH",
            "GBCH",
          ]);
          gbch = foundGbch ? foundGbch.id : null;
        }

        // RH (nullable)
        let rh = null;
        if (row["ASSIGNED RH EMP. NO."]) {
          const foundRh = findEmp(row["ASSIGNED RH EMP. NO."], ["RH", "BCH"]);
          if (!foundRh)
            throw new Error(
              `Invalid ASSIGNED RH EMP. NO. [${row["ASSIGNED RH EMP. NO."]}]`
            );
          rh = foundRh ? foundRh.id : null;
        }

        // GRH (nullable)
        let grh = null;
        if (row["ASSIGNED GRH EMP. NO."]) {
          const foundGrh = findEmp(row["ASSIGNED GRH EMP. NO."], ["RH", "GRH"]);
          grh = foundGrh ? foundGrh.id : null;
        }

        // 3. Status mapping
        let status_id: number | undefined = undefined;
        if (row["STATUS"]) {
          const statusName = String(row["STATUS"]).trim().toUpperCase();
          if (statusName === "ACTIVE") status_id = 1;
          else if (statusName === "INACTIVE") status_id = 2;
          else {
            // Try to lookup by status name
            const status = statuses.find(
              (s) => String(s.status_name).trim().toUpperCase() === statusName
            );
            if (status) status_id = status.id;
            else throw new Error("Invalid STATUS value");
          }
        }

        records.push({
          warehouse_id: warehouse.id,
          assigned_ss: ss.id,
          assigned_ah: ah.id,
          assigned_bch: bch,
          assigned_gbch: gbch,
          assigned_rh: rh,
          assigned_grh: grh,
          status_id,
          __rowNum__: excelRowNum,
        } as any);
      } catch (err) {
        errors.push({ row: excelRowNum, error: err.message });
      }
    }
    // const userId = req.user.id;
    const accessKeyId = req.user.current_access_key;
    const result = await this.warehouseEmployeesService.bulkUpload(
      records,
      userId,
      accessKeyId,
      {
        batchSize: 100,
      }
    );
    // Merge mapping errors with service errors (including duplicate errors)
    result.errors = [...errors, ...(result.errors || [])];
    // Build summary message
    const summary = {
      inserted_count: result.inserted.length,
      updated_count: result.updated.length,
      inserted_row_numbers: result.inserted.map((r) => r.row),
      updated_row_numbers: result.updated.map((r) => r.row),
      errors: result.errors,
      success: result.success,
    };
    // --- Audit Trail Logging (Optimized) ---
    if (
      summary.inserted_count > 0 ||
      summary.updated_count > 0 ||
      summary.errors.length > 0
    ) {
      await this.userAuditTrailCreateService.create(
        {
          service: "WarehouseEmployeesController",
          method: "uploadExcel",
          raw_data: JSON.stringify({
            file: file.originalname,
            records: records.slice(0, 65535),
          }),
          description: `Bulk upload via Excel: ${summary.inserted_count} inserted, ${summary.updated_count} updated, ${summary.errors.length} errors.`,
          status_id: summary.errors.length === 0 ? 1 : 2,
        },
        userId
      );
    }
    return summary;
  }
}

interface ExcelFileFilterRequest extends ExpressRequest {
  file: Express.Multer.File;
}

type ExcelFileFilterCallback = (
  error: Error | null,
  acceptFile: boolean
) => void;

function excelFileFilter(
  req: ExcelFileFilterRequest,
  file: Express.Multer.File,
  cb: ExcelFileFilterCallback
): void {
  if (!file.originalname.match(/\.(xlsx|xls)$/)) {
    return cb(new Error("Only Excel files are allowed!"), false);
  }
  cb(null, true);
}

interface FileNameRequest extends ExpressRequest {}
interface FileNameFile extends Express.Multer.File {}

function fileName(
  req: FileNameRequest,
  file: FileNameFile,
  cb: (error: Error | null, filename: string) => void
): void {
  cb(null, `${Date.now()}-${file.originalname}`);
}
