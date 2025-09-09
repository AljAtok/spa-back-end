import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserPermissions } from "../entities/UserPermissions";
import { Module } from "../entities/Module";
import { Action } from "../entities/Action";
import {
  PERMISSIONS_KEY,
  PermissionRequirement,
} from "../decorators/permissions.decorator";
import logger from "../config/logger";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(UserPermissions)
    private userPermissionsRepository: Repository<UserPermissions>,
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
    @InjectRepository(Action)
    private actionRepository: Repository<Action>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionRequirement[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException("User not authenticated");
    }

    try {
      // Check each required permission
      for (const permission of requiredPermissions) {
        const hasPermission = await this.checkUserPermission(
          user.id,
          permission.module,
          permission.action,
          user.current_access_key // Include access key ID
        );

        if (!hasPermission) {
          logger.warn(
            `User ${user.id} denied access: Missing ${permission.action} permission for ${permission.module} module with access key ${user.current_access_key}`
          );
          throw new ForbiddenException(
            `Access denied: You don't have ${permission.action} permission for ${permission.module}`
          );
        }
      }

      return true;
    } catch (error) {
      logger.error("Error checking permissions:", error);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException("Permission check failed");
    }
  }
  private async checkUserPermission(
    userId: number,
    moduleName: string,
    actionName: string,
    accessKeyId?: number
  ): Promise<boolean> {
    try {
      // Find the module by name
      const module = await this.moduleRepository.findOne({
        where: { module_name: moduleName.toUpperCase() },
      });

      if (!module) {
        logger.warn(`Module not found: ${moduleName}`);
        return false;
      }

      // Find the action by name
      const action = await this.actionRepository.findOne({
        where: { action_name: actionName.toUpperCase() },
      });

      if (!action) {
        logger.warn(`Action not found: ${actionName}`);
        return false;
      }

      // Build permission query conditions
      const whereConditions: any = {
        user_id: userId,
        module_id: module.id,
        action_id: action.id,
        status_id: 1, // Active status
      };

      // Add access key filter if provided
      if (accessKeyId) {
        whereConditions.access_key_id = accessKeyId;
      }

      // Check if user has the permission
      const userPermission = await this.userPermissionsRepository.findOne({
        where: whereConditions,
      });

      return !!userPermission;
    } catch (error) {
      logger.error("Error in checkUserPermission:", error);
      return false;
    }
  }
}
