import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";
import { ApiService } from "./api.service";

@Controller("api")
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  // Generic GET endpoint
  @Get(":endpoint")
  async getData(
    @Param("endpoint") endpoint: string,
    @Query() query: any,
    @Headers("x-api-key") apiKey: string,
    @Req() request: Request
  ) {
    return await this.handleRequest(
      "GET",
      endpoint,
      { query },
      apiKey,
      request
    );
  }

  // Generic POST endpoint
  @Post(":endpoint")
  @HttpCode(HttpStatus.OK)
  async postData(
    @Param("endpoint") endpoint: string,
    @Body() body: any,
    @Query() query: any,
    @Headers("x-api-key") apiKey: string,
    @Req() request: Request
  ) {
    return await this.handleRequest(
      "POST",
      endpoint,
      { body, query },
      apiKey,
      request
    );
  }

  // Generic PUT endpoint
  @Put(":endpoint")
  async putData(
    @Param("endpoint") endpoint: string,
    @Body() body: any,
    @Query() query: any,
    @Headers("x-api-key") apiKey: string,
    @Req() request: Request
  ) {
    return await this.handleRequest(
      "PUT",
      endpoint,
      { body, query },
      apiKey,
      request
    );
  }

  // Generic DELETE endpoint
  @Delete(":endpoint")
  async deleteData(
    @Param("endpoint") endpoint: string,
    @Query() query: any,
    @Headers("x-api-key") apiKey: string,
    @Req() request: Request
  ) {
    return await this.handleRequest(
      "DELETE",
      endpoint,
      { query },
      apiKey,
      request
    );
  }

  // Specific warehouse-hurdles endpoint for backward compatibility
  @Get("warehouse-hurdles")
  async getWarehouseHurdles(
    @Query() query: any,
    @Headers("x-api-key") apiKey: string,
    @Req() request: Request
  ) {
    return await this.handleRequest(
      "GET",
      "warehouse-hurdles",
      { query },
      apiKey,
      request
    );
  }

  private async handleRequest(
    method: string,
    endpoint: string,
    params: any,
    apiKey: string,
    request: Request
  ) {
    const clientIp =
      request.ip || request.connection.remoteAddress || "unknown";
    const uri = `${request.protocol}://${request.get("host")}${request.originalUrl}`;
    let authorized = 0;
    let apiKeyRecord = null;
    let responseCode = HttpStatus.OK;

    try {
      // Validate API key
      if (!apiKey) {
        throw new UnauthorizedException(
          "API key is required in x-api-key header"
        );
      }

      apiKeyRecord = await this.apiService.validateApiKey(apiKey);

      // Check access permission
      const hasAccess = await this.apiService.checkAccessPermission(
        apiKeyRecord.id,
        endpoint
      );

      if (!hasAccess) {
        authorized = 0;
        responseCode = HttpStatus.FORBIDDEN;
        throw new ForbiddenException(`Access denied for endpoint: ${endpoint}`);
      }

      authorized = 1;

      // Get data from the endpoint
      const data = await this.apiService.getDataByEndpoint(endpoint, params);

      // Log successful request
      await this.apiService.logApiRequest({
        uri,
        method,
        params: JSON.stringify(params),
        api_key_id: apiKeyRecord.id,
        ip_address: clientIp,
        authorized,
        response_code: responseCode,
      });

      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // Log failed request
      if (apiKeyRecord) {
        await this.apiService.logApiRequest({
          uri,
          method,
          params: JSON.stringify(params),
          api_key_id: apiKeyRecord.id,
          ip_address: clientIp,
          authorized,
          response_code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        });
      } else {
        // Log without API key ID if validation failed
        await this.apiService.logApiRequest({
          uri,
          method,
          params: JSON.stringify(params),
          ip_address: clientIp,
          authorized: 0,
          response_code: error.status || HttpStatus.UNAUTHORIZED,
        });
      }

      throw error;
    }
  }
}
