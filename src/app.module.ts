import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { APP_FILTER } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";

// Configuration
import configuration from "./config/configuration";
import { DatabaseModule } from "./database/database.module";

// Entities
import { User } from "./entities/User";
import { Module as ModuleEntity } from "./entities/Module";
import { Action } from "./entities/Action";
import { Location } from "./entities/Location";
import { UserPermissions } from "./entities/UserPermissions";
import { UserLoginSession } from "./entities/UserLoginSession";

// Services
import { EmailService } from "./services/email.service";

// Modules
import { UsersModule } from "./modules/users/users.module";
import { EmployeesModule } from "./modules/employees/employees.module";
import { RolesModule } from "./modules/roles/roles.module";
import { StatusModule } from "./modules/status/status.module";
import { ThemesModule } from "./modules/themes/themes.module";
import { LocationsModule } from "./modules/locations/locations.module";
import { CompaniesModule } from "./modules/companies/companies.module";
import { WarehousesModule } from "./modules/warehouses/warehouses.module";
import { ItemsModule } from "./modules/items/items.module";
import { ActionsModule } from "./modules/actions/actions.module";
import { AccessKeysModule } from "./modules/access-keys/access-keys.module";
import { RegionsModule } from "./modules/regions/regions.module";
import { SegmentsModule } from "./modules/segments/segments.module";
import { PositionsModule } from "./modules/positions/positions.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { JwtStrategy } from "./guards/jwt.strategy";
import { PermissionsGuard } from "./guards/permissions.guard";
import { DynamicPermissionsGuard } from "./guards/dynamic-permissions.guard";
import { AllExceptionsFilter } from "./common/all-exceptions.filter";
import { UserAuditTrailModule } from "./modules/users/user-audit-trail.module";
import { SchedulersModule } from "./modules/schedulers/schedulers.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ModulesModule } from "./modules/modules/modules.module";
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Database
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      UserLoginSession,
      UserPermissions,
      ModuleEntity,
      Action,
      Location,
    ]),
    // Authentication
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || "your-secret-key",
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "10m" },
      }),
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    EmployeesModule,
    RolesModule,
    StatusModule,
    ThemesModule,
    LocationsModule,
    CompaniesModule,
    WarehousesModule,
    ItemsModule,
    ActionsModule,
    AccessKeysModule,
    RegionsModule,
    SegmentsModule,
    PositionsModule,
    TransactionsModule,
    NotificationsModule,
    ReportsModule,
    DashboardModule,
    UserAuditTrailModule,
    SchedulersModule,
    AuthModule,
    ModulesModule,
  ],
  providers: [
    EmailService,
    JwtStrategy,
    PermissionsGuard,
    DynamicPermissionsGuard,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
