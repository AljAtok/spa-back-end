import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, Not, In } from "typeorm";
import { TransactionHeader } from "../entities/TransactionHeader";
import { TransactionDetail } from "../entities/TransactionDetail";
import { CreateTransactionHeaderDto } from "../dto/CreateTransactionHeaderDto";
import { UpdateTransactionHeaderDto } from "../dto/UpdateTransactionHeaderDto";
import { CreateTransactionDetailDto } from "../dto/CreateTransactionDetailDto";
import { UpdateTransactionDetailDto } from "../dto/UpdateTransactionDetailDto";
import { LocationsService } from "./locations.service";
import { UserAuditTrailCreateService } from "./user-audit-trail-create.service";
import { CreateUserAuditTrailDto } from "../dto/CreateUserAuditTrailDto";
import { UserLocationsService } from "./user-locations.service";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionHeader)
    private headerRepo: Repository<TransactionHeader>,
    @InjectRepository(TransactionDetail)
    private detailRepo: Repository<TransactionDetail>,
    private locationsService: LocationsService,
    private dataSource: DataSource,
    private userAuditTrailCreateService: UserAuditTrailCreateService,
    private userLocationsService: UserLocationsService
  ) {}

  // HEADER CRUD
  async createHeader(dto: CreateTransactionHeaderDto) {
    return this.headerRepo.save(dto);
  }

  async findAllHeaders(
    user_id?: number,
    role_id?: number,
    current_access_key?: number
  ) {
    let allowedLocationIds: number[] | undefined = undefined;
    if (user_id && role_id) {
      const userLocations = await this.userLocationsService[
        "userLocationsRepository"
      ].find({
        where: { user_id, role_id, status_id: 1 },
        select: ["location_id"],
      });
      allowedLocationIds = userLocations.map((ul) => ul.location_id);
    }
    const where: any = {};
    if (allowedLocationIds && allowedLocationIds.length > 0) {
      where.location_id = In(allowedLocationIds);
    }
    if (current_access_key) {
      where.access_key_id = current_access_key;
    }
    const headers = await this.headerRepo.find({
      where,
      relations: [
        "location",
        "status",
        "access_key",
        "created_by_user",
        "updated_by_user",
        "details",
      ],
    });
    return headers.map((header) => ({
      header: {
        trans_id: header.id,
        trans_number: header.trans_number ? header.trans_number : header.id,
        trans_date: header.trans_date,
        location_id: header.location_id,
        location_name: header.location?.location_name,
        status_id: header.status_id,
        status_name: header.status?.status_name,
        created_by: header.created_by,
        access_key_id: header.access_key_id,
        updated_by: header.updated_by,
        created_user: header.created_by_user
          ? `${header.created_by_user.first_name} ${header.created_by_user.last_name}`
          : null,
        updated_user: header.updated_by_user
          ? `${header.updated_by_user.first_name} ${header.updated_by_user.last_name}`
          : null,
        id: header.id,
        created_at: header.created_at,
        modified_at: header.modified_at,
      },
      details: (header.details || []).map((d) => ({
        warehouse_id: d.warehouse_id,
        budget_volume: d.budget_volume,
        sales_qty: d.sales_qty,
        ss_hurdle_qty: d.ss_hurdle_qty,
        rate: d.rate,
        details_status_id: d.status_id,
      })),
    }));
  }

  async findHeaderById(id: number) {
    const header = await this.headerRepo.findOne({
      where: { id },
      relations: [
        "location",
        "status",
        "access_key",
        "created_by_user",
        "updated_by_user",
        "details",
        "details.warehouse",
      ],
    });
    if (!header) return null;
    return {
      header: {
        trans_id: header.id,
        trans_date: header.trans_date,
        location_id: header.location_id,
        location_name: header.location?.location_name,
        status_id: header.status_id,
        status_name: header.status?.status_name,
        created_by: header.created_by,
        access_key_id: header.access_key_id,
        updated_by: header.updated_by,
        created_user: header.created_by_user
          ? `${header.created_by_user.first_name} ${header.created_by_user.last_name}`
          : null,
        updated_user: header.updated_by_user
          ? `${header.updated_by_user.first_name} ${header.updated_by_user.last_name}`
          : null,
        id: header.id,
        created_at: header.created_at,
        modified_at: header.modified_at,
      },
      details: (header.details || []).map((d) => ({
        details_id: d.id,
        warehouse_id: d.warehouse_id,
        warehouse_name: d.warehouse?.warehouse_name,
        budget_volume: d.budget_volume,
        sales_qty: d.sales_qty,
        ss_hurdle_qty: d.ss_hurdle_qty,
        rate: d.rate,
        details_status_id: d.status_id,
      })),
    };
  }

  async updateHeader(id: number, dto: UpdateTransactionHeaderDto) {
    await this.headerRepo.update(id, dto);
    return this.findHeaderById(id);
  }

  async removeHeader(id: number) {
    return this.headerRepo.delete(id);
  }

  // Toggle status of a transaction header
  async toggleStatus(id: number, status_id: number, user_id: number) {
    await this.headerRepo.update(id, { status_id });
    await this.userAuditTrailCreateService.create(
      {
        service: "transactions",
        method: "toggleStatus",
        raw_data: JSON.stringify({ id, status_id }),
        description: `Toggled status to ${status_id} for transaction header ${id}`,
        status_id: 1,
      },
      user_id
    );
    return this.findHeaderById(id);
  }

  // Post transaction (set status_id to 4)
  async postTransaction(id: number, user_id: number) {
    // Update header status
    const header = await this.headerRepo.findOne({
      where: { id },
      relations: ["location"],
    });
    if (!header) throw new Error("Transaction header not found");
    if (header.status_id === 4) {
      throw new Error("Transaction is already posted.");
    }
    // Check for duplicates (not cancelled)
    const duplicate = await this.headerRepo.findOne({
      where: {
        location_id: header.location_id,
        trans_date: header.trans_date,
        access_key_id: header.access_key_id,
        status_id: 4,
        id: Not(id),
      },
    });
    if (duplicate) {
      throw new Error(
        `A transaction already exists for this location, date: ${header.trans_date}, (posted).`
      );
    }
    // Generate trans_number if not set
    if (!header.trans_number) {
      // Get location_abbr
      const location_abbr = header.location?.location_abbr || "LOC";
      const access_key_id = header.access_key_id;
      const year = new Date().getFullYear();
      // Find max existing trans_number for this location/access_key/year
      const likePrefix = `${location_abbr}${access_key_id}${year}-`;
      const prev = await this.headerRepo
        .createQueryBuilder("h")
        .where("h.location_id = :location_id", {
          location_id: header.location_id,
        })
        .andWhere("h.access_key_id = :access_key_id", { access_key_id })
        .andWhere("h.trans_number LIKE :likePrefix", {
          likePrefix: `${likePrefix}%`,
        })
        .orderBy("h.trans_number", "DESC")
        .getOne();
      let nextNum = 1;
      if (prev && prev.trans_number) {
        const match = prev.trans_number.match(/-(\d{4})$/);
        if (match) nextNum = parseInt(match[1], 10) + 1;
      }
      const trans_number = `${location_abbr}${access_key_id}${year}-${nextNum.toString().padStart(4, "0")}`;
      await this.headerRepo.update(id, { trans_number });
      header.trans_number = trans_number;
    }
    await this.headerRepo.update(id, { status_id: 4, updated_by: user_id });
    await this.userAuditTrailCreateService.create(
      {
        service: "transactions",
        method: "postTransaction",
        raw_data: JSON.stringify({ id }),
        description: `Posted transaction header ${id}`,
        status_id: 1,
      },
      user_id
    );
    // Update all related details status
    await this.detailRepo.update(
      { transaction_header_id: id },
      { status_id: 4 }
    );
    return this.findHeaderById(id);
  }

  // Cancel transaction (set status_id to 5)
  async cancelTransaction(id: number, user_id: number, cancel_reason: string) {
    const header = await this.headerRepo.findOne({
      where: { id },
    });
    if (!header) throw new Error("Transaction header not found");
    if (header.status_id === 5) {
      throw new Error("Transaction header is already cancelled.");
    }

    // Update header status
    await this.headerRepo.update(id, {
      status_id: 5,
      updated_by: user_id,
      cancel_reason,
    });
    await this.userAuditTrailCreateService.create(
      {
        service: "transactions",
        method: "cancelTransaction",
        raw_data: JSON.stringify({ id }),
        description: `Cancelled transaction header ${id}, with reason: ${cancel_reason}`,
        status_id: 1,
      },
      user_id
    );
    // Update all related details status
    await this.detailRepo.update(
      { transaction_header_id: id },
      { status_id: 5 }
    );
    return this.findHeaderById(id);
  }

  // Revert transaction (set status_id to 3)
  async revertTransaction(id: number, user_id: number, undo_reason: string) {
    const header = await this.headerRepo.findOne({
      where: {
        id,
      },
    });
    if (!header) {
      throw new Error("Transaction header not found.");
    }
    if (header.status_id === 3) {
      throw new Error("Transaction is already reverted.");
    }
    const duplicate = await this.headerRepo.findOne({
      where: {
        location_id: header.location_id,
        trans_date: header.trans_date,
        access_key_id: header.access_key_id,
        status_id: Not(5),
        id: Not(id),
      },
    });
    if (duplicate) {
      throw new Error(
        `A transaction already exists for this location, date: ${header.trans_date}, (not cancelled).`
      );
    }
    // Update header status
    await this.headerRepo.update(id, {
      status_id: 3,
      updated_by: user_id,
      undo_reason,
    });
    await this.userAuditTrailCreateService.create(
      {
        service: "transactions",
        method: "revertTransaction",
        raw_data: JSON.stringify({ id }),
        description: `Reverted transaction header ${id}, with reason: ${undo_reason}`,
        status_id: 1,
      },
      user_id
    );
    // Update all related details status
    await this.detailRepo.update(
      { transaction_header_id: id },
      { status_id: 3 }
    );
    return this.findHeaderById(id);
  }

  // DETAIL CRUD
  async createDetail(dto: CreateTransactionDetailDto) {
    return this.detailRepo.save(dto);
  }

  async findAllDetails(headerId?: number) {
    if (headerId) {
      return this.detailRepo.find({
        where: { transaction_header_id: headerId },
        relations: ["warehouse", "status", "transaction_header"],
      });
    }
    return this.detailRepo.find({
      relations: ["warehouse", "status", "transaction_header"],
    });
  }

  async findDetailById(id: number) {
    return this.detailRepo.findOne({
      where: { id },
      relations: ["warehouse", "status", "transaction_header"],
    });
  }

  async updateDetail(id: number, dto: UpdateTransactionDetailDto) {
    await this.detailRepo.update(id, dto);
    return this.findDetailById(id);
  }

  async removeDetail(id: number) {
    return this.detailRepo.delete(id);
  }

  /**
   * Create transaction headers and details for multiple locations by merging sales_budget_transactions and sales_transactions
   * @param dto { location_ids, trans_date, created_by, access_key_id }
   */
  async createTransaction(dto: {
    location_ids: number[];
    trans_date: string;
    created_by: number;
    access_key_id: number;
    user_id?: number;
    role_id?: number;
  }) {
    const {
      location_ids,
      trans_date,
      created_by,
      access_key_id,
      user_id,
      role_id,
    } = dto;
    // Validate allowed locations for user
    let allowedLocationIds: number[] | undefined = undefined;
    if (user_id && role_id) {
      const userLocations = await this.userLocationsService[
        "userLocationsRepository"
      ].find({
        where: { user_id, role_id, status_id: 1 },
        select: ["location_id"],
      });
      allowedLocationIds = userLocations.map((ul) => ul.location_id);
    }
    const filteredLocationIds = allowedLocationIds
      ? location_ids.filter((id) => allowedLocationIds.includes(id))
      : location_ids;
    if (filteredLocationIds.length === 0) {
      throw new Error(
        "You are not allowed to create transactions for the selected locations."
      );
    }

    if (
      !Array.isArray(filteredLocationIds) ||
      filteredLocationIds.length === 0
    ) {
      throw new Error("location_ids must be a non-empty array.");
    }
    // 0. Batch check for duplicates (not cancelled)
    const existingHeaders = await this.headerRepo.find({
      where: filteredLocationIds.map((location_id) => ({
        location_id,
        trans_date,
        access_key_id,
        status_id: Not(5),
      })),
      relations: ["location", "status"],
    });
    const existingMap = new Map(existingHeaders.map((h) => [h.location_id, h]));
    const results = [];
    for (const location_id of filteredLocationIds) {
      if (existingMap.has(location_id)) {
        const existing = existingMap.get(location_id);
        results.push({
          location_id,
          location_name: existing.location?.location_name || null,
          status: "skipped",
          reason: `A transaction already exists for location: ${
            existing.location?.location_name || location_id
          }, date: ${trans_date}, status: ${
            existing.status?.status_name || existing.status_id
          }`,
        });
        continue;
      }
      // 1. Get location_code and location_name
      const locationRow = await this.dataSource
        .createQueryBuilder()
        .select([
          "location.id",
          "location.location_code",
          "location.location_name",
        ])
        .from("location", "location")
        .where("location.id = :id", { id: location_id })
        .getRawOne();
      if (!locationRow) {
        results.push({
          location_id,
          location_name: null,
          status: "skipped",
          reason: "Location not found",
        });
        continue;
      }
      const location_code = locationRow.location_location_code;
      const location_name = locationRow.location_location_name;
      // 2. Query sales_budget_transactions
      // Calculate quarter months based on trans_date
      // sales_month is 1-based (1=Jan, 12=Dec)
      const transDateObj = new Date(trans_date);
      const year = transDateObj.getFullYear();
      const month = transDateObj.getMonth() + 1; // 1-based month
      const quarter = Math.floor((month - 1) / 3) + 1;
      const quarterStartMonth = (quarter - 1) * 3 + 1; // 1, 4, 7, 10
      const quarterEndMonth = quarterStartMonth + 2; // 3, 6, 9, 12

      const budgetRows = await this.dataSource.query(
        `
        SELECT
          a.bc_name,
          a.bc_code,
          a.ifs_code,
          a.outlet_name,
          SUM(a.sales_det_qty) as sales_det_qty,
          SUM(a.sales_det_qty_2) as sales_det_qty_2,
          b.category2_id,
          b.category1_id,
          a.sales_month,
	        QUARTER(sales_date) as sales_quarter
        FROM sales_budget_transactions a
        INNER JOIN items b on a.material_code = b.item_code
        INNER JOIN warehouses c on a.ifs_code = c.warehouse_ifs
        LEFT JOIN warehouse_hurdles d ON d.warehouse_id = c.id 
        AND d.hurdle_date = a.sales_date 
        AND d.status_id = 7
        LEFT JOIN warehouse_hurdle_categories e ON e.item_category_id = b.category2_id 
        AND e.warehouse_hurdle_id = d.id 
        AND e.status_id = 7
        WHERE a.status_id = 1 
          AND YEAR(a.sales_date) = ?
          AND QUARTER(a.sales_date) = ?
          AND a.bc_code = ?
        GROUP BY a.bc_code, a.ifs_code, sales_quarter
        ORDER BY a.bc_code
      `,
        [year, quarter, location_code]
      );

      const budgetRowsMonthly = await this.dataSource.query(
        `
        SELECT
          a.bc_name,
          a.bc_code,
          a.ifs_code,
          a.outlet_name,
          SUM(a.sales_det_qty) as sales_det_qty,
          SUM(a.sales_det_qty_2) as sales_det_qty_2,
          b.category2_id,
          b.category1_id,
          a.sales_month,
	        QUARTER(sales_date) as sales_quarter
        FROM sales_budget_transactions a
        INNER JOIN items b on a.material_code = b.item_code
        INNER JOIN warehouses c on a.ifs_code = c.warehouse_ifs
        LEFT JOIN warehouse_hurdles d ON d.warehouse_id = c.id 
        AND d.hurdle_date = a.sales_date 
        AND d.status_id = 7
        LEFT JOIN warehouse_hurdle_categories e ON e.item_category_id = b.category2_id 
        AND e.warehouse_hurdle_id = d.id 
        AND e.status_id = 7
        WHERE a.status_id = 1 
          AND a.sales_date = ?
          AND a.bc_code = ?
        GROUP BY a.bc_code, a.ifs_code, a.sales_month
        ORDER BY a.bc_code
      `,
        [trans_date, location_code]
      );
      // 3. Query sales_transactions
      const salesRows = await this.dataSource.query(
        `
        SELECT
          a.bc_code,
          a.whs_code,
          c.id as warehouse_id,
          c.warehouse_name as whs_name,
          SUM(a.quantity) AS quantity,
          SUM(a.converted_quantity) AS converted_quantity,
          a.doc_date,
          a.doc_date_month,
          b.category2_id,
          b.category1_id,
          d.ss_hurdle_qty,
          f.warehouse_rate
        FROM sales_transactions a
        INNER JOIN items b ON b.item_code = a.item_code
        INNER JOIN warehouses c ON c.warehouse_ifs = a.whs_code
        LEFT JOIN warehouse_hurdles d ON d.warehouse_id = c.id 
        AND d.hurdle_date = a.doc_date 
        AND d.status_id = 7
        LEFT JOIN warehouse_hurdle_categories e ON e.item_category_id = b.category2_id 
        AND e.warehouse_hurdle_id = d.id 
        AND e.status_id = 7
        LEFT JOIN warehouse_rates f ON f.warehouse_id = c.id 
        AND f.status_id = a.status_id 
        WHERE a.status_id = 1 and a.doc_date = ? and a.bc_code = ?
        GROUP by a.bc_code, a.whs_code, c.id
      `,
        [trans_date, location_code]
      );
      // 4. Merge by whs_code (sales) as base, match to ifs_code (budget)
      const budgetMap = new Map();
      for (const b of budgetRows) {
        budgetMap.set(b.ifs_code, b);
      }
      // Map for monthly budget
      const budgetMonthlyMap = new Map();
      for (const b of budgetRowsMonthly) {
        budgetMonthlyMap.set(b.ifs_code, b);
      }
      const merged = [];
      for (const s of salesRows) {
        const budget = budgetMap.get(s.whs_code);
        const budgetMonthly = budgetMonthlyMap.get(s.whs_code);
        merged.push({
          warehouse_id: s.warehouse_id,
          sales_det_qty_2: budget ? Number(budget.sales_det_qty_2) : 0,
          budget_volume_monthly: budgetMonthly
            ? Number(budgetMonthly.sales_det_qty_2)
            : 0,
          converted_qty: Number(s.converted_quantity),
          ss_hurdle_qty: s.ss_hurdle_qty ? Number(s.ss_hurdle_qty) : 0,
          rate: s.warehouse_rate ? Number(s.warehouse_rate) : 0,
        });
      }
      if (!merged.length) {
        results.push({
          location_id,
          location_name,
          status: "skipped",
          reason: "No matching data to merge for transaction details.",
        });
        continue;
      }
      // 5. Insert transaction_header
      const header = await this.headerRepo.save({
        trans_date,
        location_id,
        status_id: 3, // Pending
        created_by,
        access_key_id,
      });
      // 6. Batch insert transaction_details
      const detailEntities = merged.map((row) =>
        this.detailRepo.create({
          transaction_header_id: header.id,
          warehouse_id: row.warehouse_id,
          budget_volume: row.sales_det_qty_2,
          budget_volume_monthly: row.budget_volume_monthly,
          ss_hurdle_qty: row.ss_hurdle_qty,
          sales_qty: row.converted_qty,
          rate: row.rate,
          status_id: 3,
        })
      );
      await this.detailRepo.save(detailEntities);
      // Audit trail for transaction creation
      await this.userAuditTrailCreateService.create(
        {
          service: "transactions",
          method: "createTransaction",
          raw_data: JSON.stringify({ header, details: merged }),
          description: `Created transaction header ${header.id} with ${merged.length} details for location ${location_id} (${location_code})`,
          status_id: 1,
        },
        created_by
      );
      results.push({
        location_id,
        location_name,
        status: "created",
        header_id: header.id,
        details_count: merged.length,
      });
    }
    return results;
  }

  /**
   * Batch update transaction_details and transaction_headers fields.
   * @param payload { header_updates: [{transaction_header_id, trans_date?}], detail_updates: [{transaction_header_id, rate?, ss_hurdle_qty?, budget_volume?}] }
   */
  async batchUpdateTransactions(payload: {
    header_updates?: Array<{
      transaction_header_id: number;
      trans_date?: string;
    }>;
    detail_updates?: Array<{
      transaction_header_id: number;
      rate?: number;
      ss_hurdle_qty?: number;
      budget_volume?: number;
    }>;
  }) {
    const results = { header_updates: [], detail_updates: [] };
    // 1. Batch update transaction_details
    if (payload.detail_updates && payload.detail_updates.length > 0) {
      for (const upd of payload.detail_updates) {
        const updateFields: any = {};
        if (typeof upd.rate === "number") updateFields.rate = upd.rate;
        if (typeof upd.ss_hurdle_qty === "number")
          updateFields.ss_hurdle_qty = upd.ss_hurdle_qty;
        if (typeof upd.budget_volume === "number")
          updateFields.budget_volume = upd.budget_volume;
        if (Object.keys(updateFields).length > 0) {
          await this.detailRepo.update(
            { transaction_header_id: upd.transaction_header_id },
            updateFields
          );
          results.detail_updates.push({
            transaction_header_id: upd.transaction_header_id,
            ...updateFields,
          });
        }
      }
    }
    // 2. Batch update transaction_headers (trans_date)
    if (payload.header_updates && payload.header_updates.length > 0) {
      for (const upd of payload.header_updates) {
        if (upd.trans_date) {
          // Get header to update
          const header = await this.headerRepo.findOne({
            where: { id: upd.transaction_header_id },
          });
          if (!header) {
            results.header_updates.push({
              transaction_header_id: upd.transaction_header_id,
              status: "skipped",
              reason: "Header not found",
            });
            continue;
          }
          // Check for duplicate (not cancelled)
          const duplicate = await this.headerRepo.findOne({
            where: {
              location_id: header.location_id,
              trans_date: upd.trans_date,
              access_key_id: header.access_key_id,
              status_id: Not(5),
              id: Not(header.id),
            },
          });
          if (duplicate) {
            results.header_updates.push({
              transaction_header_id: upd.transaction_header_id,
              status: "skipped",
              reason: `A transaction already exists for location: ${header.location_id}, date: ${upd.trans_date}, status: ${duplicate.status_id}`,
            });
            continue;
          }
          await this.headerRepo.update(header.id, {
            trans_date: upd.trans_date,
          });
          results.header_updates.push({
            transaction_header_id: upd.transaction_header_id,
            trans_date: upd.trans_date,
            status: "updated",
          });
        }
      }
    }
    return results;
  }

  /**
   * Generate a report joining transaction_details to warehouse_employees and employees for assigned roles
   * Returns: For each detail, includes assigned employee full names for each warehouse role
   * Optional filters: location_ids (array), trans_date (full date string, e.g. '2025-05-01'), warehouse_id, status_id
   * Now includes region.region_name in the response
   * Now validates allowed locations and access_key based on user JWT
   */
  async generateTransactionReport(filters?: {
    location_ids?: number[];
    trans_date?: string; // format: 'YYYY-MM-DD'
    warehouse_id?: number;
    status_id?: number;
    user_id?: number;
    role_id?: number;
    current_access_key?: number;
  }) {
    // Validate allowed locations for user
    let allowedLocationIds: number[] | undefined = undefined;
    if (filters?.user_id && filters?.role_id) {
      const userLocations = await this.userLocationsService[
        "userLocationsRepository"
      ].find({
        where: {
          user_id: filters.user_id,
          role_id: filters.role_id,
          status_id: 1,
        },
        select: ["location_id"],
      });
      allowedLocationIds = userLocations.map((ul) => ul.location_id);
    }

    // Build query for details with joins to header, warehouse, status, location, and region
    const qb = this.detailRepo
      .createQueryBuilder("detail")
      .leftJoinAndSelect("detail.transaction_header", "header")
      .leftJoinAndSelect("header.location", "location")
      .leftJoinAndSelect("location.region", "region")
      .leftJoinAndSelect("header.status", "status")
      .leftJoinAndSelect("detail.warehouse", "warehouse");

    // Filter by allowed locations (user)
    if (allowedLocationIds && allowedLocationIds.length > 0) {
      qb.andWhere("header.location_id IN (:...allowedLocationIds)", {
        allowedLocationIds,
      });
    }
    // Filter by current_access_key (user)
    if (filters?.current_access_key) {
      qb.andWhere("header.access_key_id = :access_key_id", {
        access_key_id: filters.current_access_key,
      });
    }
    // Optional filters
    if (filters?.location_ids && filters.location_ids.length > 0) {
      qb.andWhere("header.location_id IN (:...location_ids)", {
        location_ids: filters.location_ids,
      });
    }
    if (filters?.warehouse_id) {
      qb.andWhere("detail.warehouse_id = :warehouse_id", {
        warehouse_id: filters.warehouse_id,
      });
    }
    if (filters?.trans_date) {
      qb.andWhere("header.trans_date = :trans_date", {
        trans_date: filters.trans_date,
      });
    }
    if (filters?.status_id) {
      qb.andWhere("header.status_id = :status_id", {
        status_id: filters.status_id,
      });
    }

    const details = await qb.getMany();
    if (!details.length) return [];

    // Get all warehouse_ids from details
    const warehouseIds = [...new Set(details.map((d) => d.warehouse_id))];

    // Get all WarehouseEmployee records for these warehouses
    const warehouseEmployeeRepo = this.dataSource.getRepository(
      require("../entities/WarehouseEmployee").WarehouseEmployee
    );
    const warehouseEmployees = await warehouseEmployeeRepo.find({
      where: { warehouse_id: In(warehouseIds), status_id: 1 },
      relations: [
        "assignedSs",
        "assignedAh",
        "assignedBch",
        "assignedGbch",
        "assignedRh",
        "assignedGrh",
      ],
    });
    // Map warehouse_id to WarehouseEmployee
    const warehouseEmployeeMap = new Map();
    for (const we of warehouseEmployees) {
      warehouseEmployeeMap.set(we.warehouse_id, we);
    }

    // Build report
    const report = details.map((detail) => {
      const we = warehouseEmployeeMap.get(detail.warehouse_id);
      const header = detail.transaction_header;
      return {
        detail_id: detail.id,
        transaction_header_id: detail.transaction_header_id,
        warehouse_id: detail.warehouse_id,
        warehouse_ifs: detail.warehouse?.warehouse_ifs,
        warehouse_name: detail.warehouse?.warehouse_name,
        budget_volume: detail.budget_volume,
        budget_volume_monthly: detail.budget_volume_monthly,
        sales_qty: detail.sales_qty,
        ss_hurdle_qty: detail.ss_hurdle_qty,
        rate: detail.rate,
        details_status_id: detail.status_id,
        assigned_ss_name: we?.assignedSs
          ? `${we.assignedSs.employee_first_name} ${we.assignedSs.employee_last_name}`
          : null,
        assigned_ah_name: we?.assignedAh
          ? `${we.assignedAh.employee_first_name} ${we.assignedAh.employee_last_name}`
          : null,
        assigned_bch_name: we?.assignedBch
          ? `${we.assignedBch.employee_first_name} ${we.assignedBch.employee_last_name}`
          : null,
        assigned_gbch_name: we?.assignedGbch
          ? `${we.assignedGbch.employee_first_name} ${we.assignedGbch.employee_last_name}`
          : null,
        assigned_rh_name: we?.assignedRh
          ? `${we.assignedRh.employee_first_name} ${we.assignedRh.employee_last_name}`
          : null,
        assigned_grh_name: we?.assignedGrh
          ? `${we.assignedGrh.employee_first_name} ${we.assignedGrh.employee_last_name}`
          : null,
        // Transaction header info
        trans_number: header?.trans_number,
        location_name: header?.location?.location_name,
        trans_date: header?.trans_date,
        trans_year: header?.trans_date
          ? new Date(header.trans_date).getFullYear()
          : null,
        status_name: header?.status?.status_name,
        region_name: header?.location?.region?.region_name || null,
      };
    });
    return report;
  }
}
