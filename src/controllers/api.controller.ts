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
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { ApiService } from "../services/api.service";
import { ApiKeyGuard } from "../guards/api-key.guard";

@Controller("api")
@UseGuards(ApiKeyGuard)
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get(":endpoint")
  async getData(
    @Param("endpoint") endpoint: string,
    @Query() queryParams: any,
    @Req() request: any
  ) {
    try {
      return await this.apiService.handleGetRequest(
        endpoint,
        queryParams,
        request.apiKey
      );
    } catch (error) {
      throw new HttpException(
        error.message || "Internal server error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(":endpoint")
  async createData(
    @Param("endpoint") endpoint: string,
    @Body() data: any,
    @Req() request: any
  ) {
    try {
      return await this.apiService.handlePostRequest(
        endpoint,
        data,
        request.apiKey
      );
    } catch (error) {
      throw new HttpException(
        error.message || "Internal server error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(":endpoint/:id")
  async updateData(
    @Param("endpoint") endpoint: string,
    @Param("id") id: number,
    @Body() data: any,
    @Req() request: any
  ) {
    try {
      return await this.apiService.handlePutRequest(
        endpoint,
        id,
        data,
        request.apiKey
      );
    } catch (error) {
      throw new HttpException(
        error.message || "Internal server error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(":endpoint/:id")
  async deleteData(
    @Param("endpoint") endpoint: string,
    @Param("id") id: number,
    @Req() request: any
  ) {
    try {
      return await this.apiService.handleDeleteRequest(
        endpoint,
        id,
        request.apiKey
      );
    } catch (error) {
      throw new HttpException(
        error.message || "Internal server error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
