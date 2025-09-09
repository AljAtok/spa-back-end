import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiKey } from "../entities/ApiKey";
import { ApiAuthAccess } from "../entities/ApiAuthAccess";
import { ApiLogs } from "../entities/ApiLogs";
import { WarehouseHurdle } from "../entities/WarehouseHurdle";
import { WarehouseHurdleCategory } from "../entities/WarehouseHurdleCategory";

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
    @InjectRepository(ApiAuthAccess)
    private apiAuthAccessRepository: Repository<ApiAuthAccess>,
    @InjectRepository(ApiLogs)
    private apiLogsRepository: Repository<ApiLogs>,
    @InjectRepository(WarehouseHurdle)
    private warehouseHurdleRepository: Repository<WarehouseHurdle>,
    @InjectRepository(WarehouseHurdleCategory)
    private warehouseHurdleCategoryRepository: Repository<WarehouseHurdleCategory>
  ) {}

  async validateApiKey(apiKey: string): Promise<ApiKey> {
    const key = await this.apiKeyRepository.findOne({
      where: { api_keys: apiKey, status_id: 1 },
    });

    if (!key) {
      throw new HttpException("Invalid API key", HttpStatus.UNAUTHORIZED);
    }

    return key;
  }

  async checkApiAccess(
    apiKeyId: number,
    endpoint: string,
    method: string
  ): Promise<boolean> {
    const access = await this.apiAuthAccessRepository.findOne({
      where: {
        api_key_id: apiKeyId,
        controller_url: endpoint,
        api_method: method,
        status_id: 1,
      },
    });

    return !!access || access?.all_access === 1;
  }

  async logApiRequest(
    apiKeyId: number,
    endpoint: string,
    method: string,
    requestData: any,
    responseData: any,
    statusCode: number
  ): Promise<void> {
    const log = this.apiLogsRepository.create({
      api_key_id: apiKeyId,
      uri: endpoint,
      method: method.toUpperCase(),
      params: JSON.stringify({
        request: requestData,
        response: responseData,
      }).slice(0, 65535),
      response_code: statusCode,
      time: new Date(),
      authorized: statusCode < 400 ? 1 : 0,
      status_id: 1, // Default active status
    });

    await this.apiLogsRepository.save(log);
  }

  async handleGetRequest(
    endpoint: string,
    queryParams: any,
    apiKeyEntity: any
  ): Promise<any> {
    const hasAccess = await this.checkApiAccess(
      apiKeyEntity.id,
      endpoint,
      "GET"
    );

    if (!hasAccess) {
      await this.logApiRequest(
        apiKeyEntity.id,
        endpoint,
        "GET",
        queryParams,
        null,
        403
      );
      throw new HttpException(
        "Access denied for this endpoint",
        HttpStatus.FORBIDDEN
      );
    }

    let responseData: any;
    let statusCode = 200;

    try {
      responseData = await this.getDataByEndpoint(endpoint, queryParams);
    } catch (error) {
      statusCode = error.status || 500;
      responseData = { error: error.message };
      await this.logApiRequest(
        apiKeyEntity.id,
        endpoint,
        "GET",
        queryParams,
        responseData,
        statusCode
      );
      throw error;
    }

    await this.logApiRequest(
      apiKeyEntity.id,
      endpoint,
      "GET",
      queryParams,
      responseData,
      statusCode
    );
    return responseData;
  }

  async handlePostRequest(
    endpoint: string,
    data: any,
    apiKeyEntity: any
  ): Promise<any> {
    const hasAccess = await this.checkApiAccess(
      apiKeyEntity.id,
      endpoint,
      "POST"
    );
    if (!hasAccess) {
      await this.logApiRequest(
        apiKeyEntity.id,
        endpoint,
        "POST",
        data,
        null,
        403
      );
      throw new HttpException(
        "Access denied for this endpoint",
        HttpStatus.FORBIDDEN
      );
    }

    let responseData: any;
    let statusCode = 201;

    try {
      responseData = await this.createDataByEndpoint(endpoint, data);
    } catch (error) {
      statusCode = error.status || 500;
      responseData = { error: error.message };
      await this.logApiRequest(
        apiKeyEntity.id,
        endpoint,
        "POST",
        data,
        responseData,
        statusCode
      );
      throw error;
    }

    await this.logApiRequest(
      apiKeyEntity.id,
      endpoint,
      "POST",
      data,
      responseData,
      statusCode
    );
    return responseData;
  }

  async handlePutRequest(
    endpoint: string,
    id: number,
    data: any,
    apiKeyEntity: any
  ): Promise<any> {
    const hasAccess = await this.checkApiAccess(
      apiKeyEntity.id,
      endpoint,
      "PUT"
    );
    if (!hasAccess) {
      await this.logApiRequest(
        apiKeyEntity.id,
        endpoint,
        "PUT",
        { id, ...data },
        null,
        403
      );
      throw new HttpException(
        "Access denied for this endpoint",
        HttpStatus.FORBIDDEN
      );
    }

    let responseData: any;
    let statusCode = 200;

    try {
      responseData = await this.updateDataByEndpoint(endpoint, id, data);
    } catch (error) {
      statusCode = error.status || 500;
      responseData = { error: error.message };
      await this.logApiRequest(
        apiKeyEntity.id,
        endpoint,
        "PUT",
        { id, ...data },
        responseData,
        statusCode
      );
      throw error;
    }

    await this.logApiRequest(
      apiKeyEntity.id,
      endpoint,
      "PUT",
      { id, ...data },
      responseData,
      statusCode
    );
    return responseData;
  }

  async handleDeleteRequest(
    endpoint: string,
    id: number,
    apiKeyEntity: any
  ): Promise<any> {
    const hasAccess = await this.checkApiAccess(
      apiKeyEntity.id,
      endpoint,
      "DELETE"
    );
    if (!hasAccess) {
      await this.logApiRequest(
        apiKeyEntity.id,
        endpoint,
        "DELETE",
        { id },
        null,
        403
      );
      throw new HttpException(
        "Access denied for this endpoint",
        HttpStatus.FORBIDDEN
      );
    }

    let responseData: any;
    let statusCode = 200;

    try {
      responseData = await this.deleteDataByEndpoint(endpoint, id);
    } catch (error) {
      statusCode = error.status || 500;
      responseData = { error: error.message };
      await this.logApiRequest(
        apiKeyEntity.id,
        endpoint,
        "DELETE",
        { id },
        responseData,
        statusCode
      );
      throw error;
    }

    await this.logApiRequest(
      apiKeyEntity.id,
      endpoint,
      "DELETE",
      { id },
      responseData,
      statusCode
    );
    return responseData;
  }

  private async getDataByEndpoint(
    endpoint: string,
    queryParams: any
  ): Promise<any> {
    switch (endpoint) {
      case "warehouse-hurdles":
        const queryBuilder = this.warehouseHurdleRepository
          .createQueryBuilder("warehouse_hurdles")
          .leftJoin(
            "warehouses",
            "warehouses",
            "warehouse_hurdles.warehouse_id = warehouses.id"
          )
          .select([
            "warehouses.warehouse_name as warehouse_name",
            "warehouses.warehouse_ifs as warehouse_ifs",
            "warehouses.warehouse_code as warehouse_code",
            "warehouse_hurdles.ss_hurdle_qty as hurdle_qty",
          ]);

        queryBuilder.where("warehouse_hurdles.status_id = :statusId", {
          statusId: queryParams.status_id ?? 7,
        });

        queryBuilder.orderBy("warehouses.warehouse_ifs", "ASC");

        return await queryBuilder.getRawMany();

      case "warehouse-hurdle-categories":
        return await this.warehouseHurdleCategoryRepository.find({
          where: queryParams.status_id
            ? { status_id: queryParams.status_id }
            : {},
          relations: ["status"],
        });

      default:
        throw new HttpException(
          `Endpoint '${endpoint}' not supported`,
          HttpStatus.NOT_FOUND
        );
    }
  }

  private async createDataByEndpoint(
    endpoint: string,
    data: any
  ): Promise<any> {
    switch (endpoint) {
      case "warehouse-hurdles":
        const newHurdle = this.warehouseHurdleRepository.create(data);
        return await this.warehouseHurdleRepository.save(newHurdle);

      case "warehouse-hurdle-categories":
        const newCategory = this.warehouseHurdleCategoryRepository.create(data);
        return await this.warehouseHurdleCategoryRepository.save(newCategory);

      default:
        throw new HttpException(
          `Endpoint '${endpoint}' not supported for creation`,
          HttpStatus.NOT_FOUND
        );
    }
  }

  private async updateDataByEndpoint(
    endpoint: string,
    id: number,
    data: any
  ): Promise<any> {
    switch (endpoint) {
      case "warehouse-hurdles":
        await this.warehouseHurdleRepository.update(id, data);
        return await this.warehouseHurdleRepository.findOne({ where: { id } });

      case "warehouse-hurdle-categories":
        await this.warehouseHurdleCategoryRepository.update(id, data);
        return await this.warehouseHurdleCategoryRepository.findOne({
          where: { id },
        });

      default:
        throw new HttpException(
          `Endpoint '${endpoint}' not supported for updates`,
          HttpStatus.NOT_FOUND
        );
    }
  }

  private async deleteDataByEndpoint(
    endpoint: string,
    id: number
  ): Promise<any> {
    switch (endpoint) {
      case "warehouse-hurdles":
        const hurdle = await this.warehouseHurdleRepository.findOne({
          where: { id },
        });
        if (!hurdle) {
          throw new HttpException(
            "Warehouse hurdle not found",
            HttpStatus.NOT_FOUND
          );
        }
        await this.warehouseHurdleRepository.remove(hurdle);
        return { message: "Warehouse hurdle deleted successfully" };

      case "warehouse-hurdle-categories":
        const category = await this.warehouseHurdleCategoryRepository.findOne({
          where: { id },
        });
        if (!category) {
          throw new HttpException(
            "Warehouse hurdle category not found",
            HttpStatus.NOT_FOUND
          );
        }
        await this.warehouseHurdleCategoryRepository.remove(category);
        return { message: "Warehouse hurdle category deleted successfully" };

      default:
        throw new HttpException(
          `Endpoint '${endpoint}' not supported for deletion`,
          HttpStatus.NOT_FOUND
        );
    }
  }
}
