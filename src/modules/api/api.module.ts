import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiController } from "../../controllers/api.controller";
import { ApiService } from "../../services/api.service";
import { ApiKeyGuard } from "../../guards/api-key.guard";
import { ApiKey } from "../../entities/ApiKey";
import { ApiAuthAccess } from "../../entities/ApiAuthAccess";
import { ApiLogs } from "../../entities/ApiLogs";
import { WarehouseHurdle } from "../../entities/WarehouseHurdle";
import { WarehouseHurdleCategory } from "../../entities/WarehouseHurdleCategory";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApiKey,
      ApiAuthAccess,
      ApiLogs,
      WarehouseHurdle,
      WarehouseHurdleCategory,
    ]),
  ],
  controllers: [ApiController],
  providers: [ApiService, ApiKeyGuard],
  exports: [ApiService, ApiKeyGuard],
})
export class ApiModule {}
