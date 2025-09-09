import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiKey } from "../../entities/ApiKey";
import { ApiAuthAccess } from "../../entities/ApiAuthAccess";
import { ApiLogs } from "../../entities/ApiLogs";

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
    @InjectRepository(ApiAuthAccess)
    private apiAuthAccessRepository: Repository<ApiAuthAccess>,
    @InjectRepository(ApiLogs)
    private apiLogsRepository: Repository<ApiLogs>
  ) {}

  async validateApiKey(apiKey: string): Promise<ApiKey> {
    const key = await this.apiKeyRepository.findOne({
      where: { api_keys: apiKey, status_id: 1 },
    });

    if (!key) {
      throw new UnauthorizedException("Invalid API key");
    }

    return key;
  }

  async checkAccessPermission(
    apiKeyId: number,
    controllerUrl: string
  ): Promise<boolean> {
    // Check if API key has all_access or specific controller access
    const access = await this.apiAuthAccessRepository.findOne({
      where: [
        { api_key_id: apiKeyId, all_access: 1, status_id: 1 },
        { api_key_id: apiKeyId, controller_url: controllerUrl, status_id: 1 },
      ],
    });

    return !!access;
  }

  async logApiRequest(logData: {
    uri: string;
    method: string;
    params?: string;
    api_key_id?: number;
    ip_address?: string;
    authorized: number;
    response_code?: number;
  }): Promise<void> {
    const apiLog = this.apiLogsRepository.create({
      ...logData,
      time: new Date(),
      created_at: new Date(),
    });

    await this.apiLogsRepository.save(apiLog);
  }

  async getDataByEndpoint(endpoint: string, params?: any): Promise<any> {
    // Dynamic data retrieval based on endpoint
    switch (endpoint) {
      case "warehouse-hurdles":
        return await this.getWarehouseHurdles(params);
      case "warehouse-types":
        return await this.getWarehouseTypes(params);
      case "warehouses":
        return await this.getWarehouses(params);
      // Add more endpoints as needed
      default:
        throw new ForbiddenException(`Endpoint '${endpoint}' not supported`);
    }
  }

  private async getWarehouseHurdles(params?: any): Promise<any> {
    // This would connect to your WarehouseHurdlesService
    // For now, return a placeholder
    return {
      endpoint: "warehouse-hurdles",
      data: [],
      message: "Warehouse hurdles data would be returned here",
      params,
    };
  }

  private async getWarehouseTypes(params?: any): Promise<any> {
    return {
      endpoint: "warehouse-types",
      data: [],
      message: "Warehouse types data would be returned here",
      params,
    };
  }

  private async getWarehouses(params?: any): Promise<any> {
    return {
      endpoint: "warehouses",
      data: [],
      message: "Warehouses data would be returned here",
      params,
    };
  }
}
