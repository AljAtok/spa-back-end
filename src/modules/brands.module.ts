import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Brand } from "../entities/Brand";
import { BrandsService } from "../services/brands.service";
import { BrandsController } from "../controllers/brands.controller";
import { UsersService } from "../services/users.service";
import { User } from "../entities/User";
import { Status } from "../entities/Status";
import { Role } from "../entities/Role";
import { Theme } from "../entities/Theme";
import { UserPermissions } from "../entities/UserPermissions";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Brand,
      User,
      Status,
      Role,
      Theme,
      UserPermissions,
    ]),
  ],
  providers: [BrandsService, UsersService],
  controllers: [BrandsController],
  exports: [BrandsService],
})
export class BrandsModule {}
