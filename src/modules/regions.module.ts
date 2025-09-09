import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RegionsService } from "../services/regions.service";
import { RegionsController } from "../controllers/regions.controller";
import { Region } from "../entities/Region";
import { UsersService } from "../services/users.service";
import { User } from "../entities/User";
import { UserPermissions } from "../entities/UserPermissions";
import { UserLocations } from "../entities/UserLocations";
import { UserLoginSession } from "../entities/UserLoginSession";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Region,
      User,
      UserPermissions,
      UserLocations,
      UserLoginSession,
    ]),
  ],
  controllers: [RegionsController],
  providers: [RegionsService, UsersService],
  exports: [RegionsService],
})
export class RegionsModule {}
