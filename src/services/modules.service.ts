import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Module } from "../entities/Module";
import { User } from "../entities/User";
import { Status } from "../entities/Status";
import { CreateModuleDto } from "../dto/CreateModuleDto";
import { UpdateModuleDto } from "../dto/UpdateModuleDto";
import logger from "../config/logger";
import { UserAuditTrailCreateService } from "./user-audit-trail-create.service";
import { CreateUserAuditTrailDto } from "../dto/CreateUserAuditTrailDto";

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
    private userAuditTrailCreateService: UserAuditTrailCreateService
  ) {}

  async findAll(): Promise<any[]> {
    try {
      const modules = await this.moduleRepository.find({
        relations: ["createdBy", "updatedBy", "status"],
        order: {
          order_level: "ASC",
        },
      });

      const flattenedModules = modules.map((module) => ({
        id: module.id,
        module_name: module.module_name,
        module_alias: module.module_alias,
        module_link: module.module_link,
        menu_title: module.menu_title,
        parent_title: module.parent_title,
        link_name: module.link_name,
        order_level: module.order_level,
        status_id: module.status_id,
        created_at: module.created_at,
        created_by: module.created_by,
        updated_by: module.updated_by || null,
        modified_at: module.modified_at,
        created_user: module.createdBy
          ? `${module.createdBy.first_name} ${module.createdBy.last_name}`
          : null,
        updated_user: module.updatedBy
          ? `${module.updatedBy.first_name} ${module.updatedBy.last_name}`
          : null,
        status_name: module.status ? module.status.status_name : null,
      }));

      logger.info("Successfully retrieved all modules.");
      return flattenedModules;
    } catch (error) {
      logger.error("Error retrieving modules:", error);
      throw new Error("Failed to retrieve modules.");
    }
  }

  async findOne(id: number): Promise<any> {
    if (isNaN(id)) {
      throw new BadRequestException("Invalid module ID provided.");
    }

    try {
      const module = await this.moduleRepository.findOne({
        where: { id },
        relations: ["createdBy", "updatedBy", "status"],
      });

      if (!module) {
        throw new NotFoundException(`Module with ID ${id} not found.`);
      }

      const flattenedModule = {
        id: module.id,
        module_name: module.module_name,
        module_alias: module.module_alias,
        module_link: module.module_link,
        menu_title: module.menu_title,
        parent_title: module.parent_title,
        link_name: module.link_name,
        order_level: module.order_level,
        status_id: module.status_id,
        created_at: module.created_at,
        created_by: module.created_by,
        updated_by: module.updated_by || null,
        modified_at: module.modified_at,
        created_user: module.createdBy
          ? `${module.createdBy.first_name} ${module.createdBy.last_name}`
          : null,
        updated_user: module.updatedBy
          ? `${module.updatedBy.first_name} ${module.updatedBy.last_name}`
          : null,
        status_name: module.status ? module.status.status_name : null,
      };

      logger.info(`Successfully retrieved module with ID: ${id}`);
      return flattenedModule;
    } catch (error) {
      logger.error(`Error retrieving module with ID ${id}:`, error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error(`Failed to retrieve module with ID ${id}.`);
    }
  }

  async create(
    createModuleDto: CreateModuleDto,
    authenticatedUserId: number
  ): Promise<any> {
    const {
      module_name,
      module_alias,
      module_link,
      menu_title,
      parent_title,
      link_name,
      order_level,
      status_id,
    } = createModuleDto;

    if (!authenticatedUserId) {
      throw new UnauthorizedException(
        "Authenticated user ID is required to create a module."
      );
    }

    try {
      // Check if module with this name or alias already exists
      const existingModuleByName = await this.moduleRepository.findOneBy({
        module_name,
      });
      if (existingModuleByName) {
        throw new BadRequestException("Module with this name already exists.");
      }

      const existingModuleByAlias = await this.moduleRepository.findOneBy({
        module_alias,
      });
      if (existingModuleByAlias) {
        throw new BadRequestException("Module with this alias already exists.");
      }

      // Validate status exists
      const statusEntity = await this.statusRepository.findOneBy({
        id: status_id,
      });
      if (!statusEntity) {
        throw new BadRequestException(`Status with ID ${status_id} not found.`);
      }

      // Validate created_by user exists
      const createdByUser = await this.userRepository.findOneBy({
        id: authenticatedUserId,
      });
      if (!createdByUser) {
        throw new BadRequestException("Authenticated user not found.");
      }

      const module = new Module();
      module.module_name = module_name;
      module.module_alias = module_alias;
      module.module_link = module_link;
      module.menu_title = menu_title;
      module.parent_title = parent_title;
      module.link_name = link_name;
      module.order_level = order_level;
      module.status = statusEntity;
      module.status_id = statusEntity.id;
      module.createdBy = createdByUser;
      module.created_by = createdByUser.id;

      const savedModule = await this.moduleRepository.save(module);

      // Audit trail
      await this.userAuditTrailCreateService.create(
        {
          service: "ModulesService",
          method: "create",
          raw_data: JSON.stringify(savedModule),
          description: `Created module ${savedModule.id} - ${savedModule.module_name} | ${savedModule.module_alias}`,
          status_id: 1,
        },
        authenticatedUserId
      );

      // Fetch the created module with relations
      const createdModule = await this.moduleRepository.findOne({
        where: { id: savedModule.id },
        relations: ["createdBy", "updatedBy", "status"],
      });

      if (!createdModule) {
        throw new Error("Failed to retrieve created module");
      }

      const flattenedModule = {
        id: createdModule.id,
        module_name: createdModule.module_name,
        module_alias: createdModule.module_alias,
        module_link: createdModule.module_link,
        menu_title: createdModule.menu_title,
        parent_title: createdModule.parent_title,
        link_name: createdModule.link_name,
        order_level: createdModule.order_level,
        status_id: createdModule.status_id,
        created_at: createdModule.created_at,
        created_by: createdModule.created_by,
        updated_by: createdModule.updated_by || null,
        modified_at: createdModule.modified_at,
        created_user: createdModule.createdBy
          ? `${createdModule.createdBy.first_name} ${createdModule.createdBy.last_name}`
          : null,
        updated_user: createdModule.updatedBy
          ? `${createdModule.updatedBy.first_name} ${createdModule.updatedBy.last_name}`
          : null,
        status_name: createdModule.status
          ? createdModule.status.status_name
          : null,
      };

      logger.info(
        `Successfully created module with ID: ${createdModule.id} by user ${authenticatedUserId}`
      );
      return flattenedModule;
    } catch (error) {
      logger.error("Error creating module:", error);
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new Error("Failed to create module.");
    }
  }

  async update(
    id: number,
    updateModuleDto: UpdateModuleDto,
    authenticatedUserId: number
  ): Promise<any> {
    if (isNaN(id)) {
      throw new BadRequestException("Invalid module ID provided for update.");
    }

    if (!authenticatedUserId) {
      throw new UnauthorizedException(
        "Authenticated user ID is required to update a module."
      );
    }

    try {
      const moduleToUpdate = await this.moduleRepository.findOne({
        where: { id },
        relations: ["createdBy", "updatedBy", "status"],
      });

      if (!moduleToUpdate) {
        throw new NotFoundException("Module not found for update.");
      }

      // Check for duplicate module_name if provided and different from current
      if (
        updateModuleDto.module_name &&
        updateModuleDto.module_name !== moduleToUpdate.module_name
      ) {
        const existingModuleByName = await this.moduleRepository.findOneBy({
          module_name: updateModuleDto.module_name,
        });
        if (existingModuleByName && existingModuleByName.id !== id) {
          throw new BadRequestException(
            "Module with this name already exists."
          );
        }
        moduleToUpdate.module_name = updateModuleDto.module_name;
      }

      // Check for duplicate module_alias if provided and different from current
      if (
        updateModuleDto.module_alias &&
        updateModuleDto.module_alias !== moduleToUpdate.module_alias
      ) {
        const existingModuleByAlias = await this.moduleRepository.findOneBy({
          module_alias: updateModuleDto.module_alias,
        });
        if (existingModuleByAlias && existingModuleByAlias.id !== id) {
          throw new BadRequestException(
            "Module with this alias already exists."
          );
        }
        moduleToUpdate.module_alias = updateModuleDto.module_alias;
      }

      // Update other fields if provided
      if (updateModuleDto.module_link !== undefined)
        moduleToUpdate.module_link = updateModuleDto.module_link;
      if (updateModuleDto.menu_title !== undefined)
        moduleToUpdate.menu_title = updateModuleDto.menu_title;
      if (updateModuleDto.parent_title !== undefined)
        moduleToUpdate.parent_title = updateModuleDto.parent_title;
      if (updateModuleDto.link_name !== undefined)
        moduleToUpdate.link_name = updateModuleDto.link_name;
      if (updateModuleDto.order_level !== undefined)
        moduleToUpdate.order_level = updateModuleDto.order_level;

      // Update status if provided
      if (updateModuleDto.status_id !== undefined) {
        const statusEntity = await this.statusRepository.findOneBy({
          id: updateModuleDto.status_id,
        });
        if (!statusEntity) {
          throw new BadRequestException(
            `Status with ID ${updateModuleDto.status_id} not found.`
          );
        }
        moduleToUpdate.status = statusEntity;
        moduleToUpdate.status_id = statusEntity.id;
      }

      // Set updatedBy user
      const updatedByUser = await this.userRepository.findOneBy({
        id: authenticatedUserId,
      });
      if (!updatedByUser) {
        throw new BadRequestException("Authenticated user not found.");
      }
      moduleToUpdate.updatedBy = updatedByUser;
      moduleToUpdate.updated_by = updatedByUser.id;

      const savedModule = await this.moduleRepository.save(moduleToUpdate);

      // Audit trail
      await this.userAuditTrailCreateService.create(
        {
          service: "ModulesService",
          method: "update",
          raw_data: JSON.stringify(moduleToUpdate),
          description: `Updated module ${id} - ${moduleToUpdate.module_name} | ${moduleToUpdate.module_alias}`,
          status_id: 1,
        },
        authenticatedUserId
      );

      // Fetch the updated module with relations
      const updatedModule = await this.moduleRepository.findOne({
        where: { id: savedModule.id },
        relations: ["createdBy", "updatedBy", "status"],
      });

      if (!updatedModule) {
        throw new Error("Failed to retrieve updated module");
      }

      const flattenedModule = {
        id: updatedModule.id,
        module_name: updatedModule.module_name,
        module_alias: updatedModule.module_alias,
        module_link: updatedModule.module_link,
        menu_title: updatedModule.menu_title,
        parent_title: updatedModule.parent_title || null,
        link_name: updatedModule.link_name,
        order_level: updatedModule.order_level,
        status_id: updatedModule.status_id,
        created_at: updatedModule.created_at,
        created_by: updatedModule.created_by,
        updated_by: updatedModule.updated_by || null,
        modified_at: updatedModule.modified_at,
        created_user: updatedModule.createdBy
          ? `${updatedModule.createdBy.first_name} ${updatedModule.createdBy.last_name}`
          : null,
        updated_user: updatedModule.updatedBy
          ? `${updatedModule.updatedBy.first_name} ${updatedModule.updatedBy.last_name}`
          : null,
        status_name: updatedModule.status
          ? updatedModule.status.status_name
          : null,
      };

      logger.info(
        `Successfully updated module with ID: ${updatedModule.id} by user ${authenticatedUserId}`
      );
      return flattenedModule;
    } catch (error) {
      logger.error(`Error updating module with ID ${id}:`, error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new Error(`Failed to update module with ID ${id}.`);
    }
  }

  async remove(id: number): Promise<any> {
    if (isNaN(id)) {
      throw new BadRequestException("Invalid module ID provided for deletion.");
    }

    try {
      const moduleToRemove = await this.moduleRepository.findOneBy({ id });

      if (!moduleToRemove) {
        throw new NotFoundException("Module not found for deletion.");
      }

      await this.moduleRepository.remove(moduleToRemove);

      logger.info(`Successfully deleted module with ID: ${id}`);
      return { message: "Module successfully deleted." };
    } catch (error) {
      logger.error(`Error deleting module with ID ${id}:`, error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error(`Failed to delete module with ID ${id}.`);
    }
  }

  async toggleStatus(id: number, authenticatedUserId: number): Promise<any> {
    if (isNaN(id)) {
      throw new BadRequestException(
        "Invalid module ID provided for status toggle."
      );
    }

    try {
      const moduleToToggle = await this.moduleRepository.findOne({
        where: { id },
        relations: ["createdBy", "updatedBy", "status"],
      });

      if (!moduleToToggle) {
        throw new NotFoundException("Module not found for status toggle.");
      }

      // Toggle status (1 = active, 2 = inactive)
      const newStatusId = moduleToToggle.status_id === 1 ? 2 : 1;
      const newStatusName = newStatusId === 1 ? "active" : "inactive";

      const statusEntity = await this.statusRepository.findOneBy({
        id: newStatusId,
      });
      if (!statusEntity) {
        throw new BadRequestException(
          `Status with ID ${newStatusId} not found.`
        );
      }

      moduleToToggle.status = statusEntity;
      moduleToToggle.status_id = newStatusId;

      // Set updatedBy user
      const updatedByUser = await this.userRepository.findOneBy({
        id: authenticatedUserId,
      });
      if (!updatedByUser) {
        throw new BadRequestException("Authenticated user not found.");
      }
      moduleToToggle.updatedBy = updatedByUser;
      moduleToToggle.updated_by = updatedByUser.id;

      const savedModule = await this.moduleRepository.save(moduleToToggle);

      // Audit trail
      await this.userAuditTrailCreateService.create(
        {
          service: "ModulesService",
          method: "toggleStatus",
          raw_data: JSON.stringify(moduleToToggle),
          description: `Toggled status for module ${id} - ${moduleToToggle.module_name} to ${newStatusName}`,
          status_id: 1,
        },
        authenticatedUserId
      );

      // Fetch updated module with relations
      const updatedModule = await this.moduleRepository.findOne({
        where: { id: savedModule.id },
        relations: ["createdBy", "updatedBy", "status"],
      });

      const statusText = newStatusId === 1 ? "activated" : "deactivated";

      logger.info(`Module ${statusText} successfully with ID: ${id}`);
      return {
        message: `Module successfully ${statusText}.`,
        module: {
          id: updatedModule!.id,
          module_name: updatedModule!.module_name,
          status_id: updatedModule!.status_id,
          status_name: updatedModule!.status.status_name,
        },
      };
    } catch (error) {
      logger.error(`Error toggling status for module with ID ${id}:`, error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error(`Failed to toggle status for module with ID ${id}.`);
    }
  }
}
