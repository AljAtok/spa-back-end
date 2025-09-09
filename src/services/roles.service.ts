import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { Status } from "../entities/Status";
import { CreateRoleDto } from "../dto/CreateRoleDto";
import { UpdateRoleDto } from "../dto/UpdateRoleDto";
import { UsersService } from "./users.service";
import { UserAuditTrailCreateService } from "./user-audit-trail-create.service";
import { CreateUserAuditTrailDto } from "../dto/CreateUserAuditTrailDto";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
    private usersService: UsersService,
    private userAuditTrailCreateService: UserAuditTrailCreateService
  ) {}

  async findAll(): Promise<any[]> {
    try {
      const roles = await this.roleRepository.find({
        relations: ["createdBy", "updatedBy", "status"],
      });

      return roles.map((role) => ({
        id: role.id,
        role_name: role.role_name,
        role_level: role.role_level,
        status_id: role.status_id,
        created_at: role.created_at,
        created_by: role.created_by,
        updated_by: role.updated_by || null,
        modified_at: role.modified_at,
        created_user: role.createdBy
          ? `${role.createdBy.first_name} ${role.createdBy.last_name}`
          : null,
        updated_user: role.updatedBy
          ? `${role.updatedBy.first_name} ${role.updatedBy.last_name}`
          : null,
        status_name: role.status ? role.status.status_name : null,
      }));
    } catch (error) {
      throw new Error("Failed to retrieve roles.");
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id },
        relations: ["createdBy", "updatedBy", "status"],
      });

      if (!role) {
        throw new NotFoundException("Role not found.");
      }

      return {
        id: role.id,
        role_name: role.role_name,
        role_level: role.role_level,
        status_id: role.status_id,
        created_at: role.created_at,
        created_by: role.created_by,
        updated_by: role.updated_by || null,
        modified_at: role.modified_at,
        created_user: role.createdBy
          ? `${role.createdBy.first_name} ${role.createdBy.last_name}`
          : null,
        updated_user: role.updatedBy
          ? `${role.updatedBy.first_name} ${role.updatedBy.last_name}`
          : null,
        status_name: role.status ? role.status.status_name : null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to retrieve role with ID ${id}.`);
    }
  }

  async create(createRoleDto: CreateRoleDto, userId: number): Promise<any> {
    try {
      // Check if role with this name already exists
      const existingRole = await this.roleRepository.findOneBy({
        role_name: createRoleDto.role_name,
      });
      if (existingRole) {
        throw new BadRequestException("Role with this name already exists.");
      }

      // Find createdBy User entity
      const createdByUser = await this.usersService.findUserById(userId);
      if (!createdByUser) {
        throw new BadRequestException("Authenticated user not found.");
      }

      // Find status entity if provided
      let statusEntity = null;
      if (createRoleDto.status_id) {
        statusEntity = await this.statusRepository.findOneBy({
          id: createRoleDto.status_id,
        });
        if (!statusEntity) {
          throw new BadRequestException(
            `Status with ID ${createRoleDto.status_id} not found.`
          );
        }
      } else {
        // Default to active status (ID: 1)
        statusEntity = await this.statusRepository.findOneBy({ id: 1 });
        if (!statusEntity) {
          throw new BadRequestException("Default status not found.");
        }
      }

      const newRole = this.roleRepository.create({
        role_name: createRoleDto.role_name,
        role_level: createRoleDto.role_level,
        status: statusEntity,
        status_id: statusEntity.id,
        createdBy: createdByUser,
        created_by: createdByUser.id,
      });

      const savedRole = await this.roleRepository.save(newRole);
      // Audit trail
      await this.userAuditTrailCreateService.create(
        {
          service: "RolesService",
          method: "create",
          raw_data: JSON.stringify(savedRole),
          description: `Created role ${savedRole.id} - ${savedRole.role_name}`,
          status_id: 1,
        },
        userId
      );

      // Return flattened structure
      return {
        id: savedRole.id,
        role_name: savedRole.role_name,
        role_level: savedRole.role_level,
        status_id: savedRole.status_id,
        created_at: savedRole.created_at,
        created_by: savedRole.created_by,
        updated_by: null,
        modified_at: savedRole.modified_at,
        created_user: `${createdByUser.first_name} ${createdByUser.last_name}`,
        updated_user: null,
        status_name: statusEntity.status_name,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error("Failed to create role.");
    }
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
    userId: number
  ): Promise<any> {
    try {
      const roleToUpdate = await this.roleRepository.findOne({
        where: { id },
        relations: ["createdBy", "status"],
      });

      if (!roleToUpdate) {
        throw new NotFoundException("Role not found for update.");
      }

      // Update role properties
      if (updateRoleDto.role_name !== undefined) {
        // Check if role with this name already exists (excluding current role)
        const existingRole = await this.roleRepository.findOne({
          where: { role_name: updateRoleDto.role_name },
        });
        if (existingRole && existingRole.id !== id) {
          throw new BadRequestException("Role with this name already exists.");
        }
        roleToUpdate.role_name = updateRoleDto.role_name;
      }

      if (updateRoleDto.role_level !== undefined) {
        roleToUpdate.role_level = updateRoleDto.role_level;
      }

      // Update status if provided
      if (updateRoleDto.status_id !== undefined) {
        const statusEntity = await this.statusRepository.findOneBy({
          id: updateRoleDto.status_id,
        });
        if (!statusEntity) {
          throw new BadRequestException(
            `Status with ID ${updateRoleDto.status_id} not found.`
          );
        }
        roleToUpdate.status = statusEntity;
        roleToUpdate.status_id = statusEntity.id;
      }

      // Set updatedBy user
      const updatedByUser = await this.usersService.findUserById(userId);
      if (!updatedByUser) {
        throw new BadRequestException("Authenticated user not found.");
      }
      roleToUpdate.updatedBy = updatedByUser;
      roleToUpdate.updated_by = updatedByUser.id;

      await this.roleRepository.save(roleToUpdate);
      // Audit trail
      await this.userAuditTrailCreateService.create(
        {
          service: "RolesService",
          method: "update",
          raw_data: JSON.stringify(roleToUpdate),
          description: `Updated role ${id} - ${roleToUpdate.role_name}`,
          status_id: 1,
        },
        userId
      );

      // Update role_action_preset status if role status is set to inactive (2)
      if (updateRoleDto.status_id !== undefined) {
        await this.roleRepository.query(
          "UPDATE role_action_preset SET status_id = ? WHERE role_id = ?",
          [updateRoleDto.status_id, id]
        );
        await this.roleRepository.query(
          "UPDATE user_permissions SET status_id = ? WHERE role_id = ?",
          [updateRoleDto.status_id, id]
        );
      }

      // Return flattened structure
      return {
        id: roleToUpdate.id,
        role_name: roleToUpdate.role_name,
        role_level: roleToUpdate.role_level,
        status_id: roleToUpdate.status_id,
        created_at: roleToUpdate.created_at,
        created_by: roleToUpdate.created_by,
        updated_by: roleToUpdate.updated_by || null,
        modified_at: roleToUpdate.modified_at,
        created_user: roleToUpdate.createdBy
          ? `${roleToUpdate.createdBy.first_name} ${roleToUpdate.createdBy.last_name}`
          : null,
        updated_user: roleToUpdate.updatedBy
          ? `${roleToUpdate.updatedBy.first_name} ${roleToUpdate.updatedBy.last_name}`
          : null,
        status_name: roleToUpdate.status
          ? roleToUpdate.status.status_name
          : null,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error("Failed to update role.");
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const roleToRemove = await this.roleRepository.findOneBy({ id });

      if (!roleToRemove) {
        throw new NotFoundException("Role not found for deletion.");
      }

      await this.roleRepository.remove(roleToRemove);
      return { message: "Role successfully deleted." };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to delete role with ID ${id}.`);
    }
  }

  async toggleStatus(id: number, userId: number): Promise<any> {
    try {
      const roleToUpdate = await this.roleRepository.findOne({
        where: { id },
        relations: ["createdBy", "updatedBy", "status"],
      });

      if (!roleToUpdate) {
        throw new NotFoundException("Role not found for status toggle.");
      }

      // Toggle status: 1 (active) -> 2 (inactive), 2 (inactive) -> 1 (active)
      const newStatusId = roleToUpdate.status_id === 1 ? 2 : 1;
      const newStatusName = newStatusId === 1 ? "ACTIVE" : "INACTIVE"; // For audit trail
      const newStatusEntity = await this.statusRepository.findOneBy({
        id: newStatusId,
      });

      if (!newStatusEntity) {
        throw new BadRequestException(
          `Target status with ID ${newStatusId} not found.`
        );
      }

      roleToUpdate.status = newStatusEntity;
      roleToUpdate.status_id = newStatusEntity.id;

      // Set updatedBy user
      const updatedByUser = await this.usersService.findUserById(userId);
      if (!updatedByUser) {
        throw new BadRequestException("Authenticated user not found.");
      }
      roleToUpdate.updatedBy = updatedByUser;
      roleToUpdate.updated_by = updatedByUser.id;

      const updatedRole = await this.roleRepository.save(roleToUpdate);
      // Audit trail
      await this.userAuditTrailCreateService.create(
        {
          service: "RolesService",
          method: "toggleStatus",
          raw_data: JSON.stringify(updatedRole),
          description: `Toggled status for role ${id} - ${roleToUpdate.role_name} to ${newStatusName} by user ${userId}`,
          status_id: 1,
        },
        userId
      );

      if (newStatusId !== undefined) {
        await this.roleRepository.query(
          "UPDATE role_action_preset SET status_id = ? WHERE role_id = ?",
          [newStatusId, id]
        );
        await this.roleRepository.query(
          "UPDATE user_permissions SET status_id = ? WHERE role_id = ?",
          [newStatusId, id]
        );
      }

      // Return flattened structure
      const flattenedUpdatedRole = {
        role_id: updatedRole.id,
        role_name: updatedRole.role_name,
        role_level: updatedRole.role_level,
        status_id: updatedRole.status_id,
        created_at: updatedRole.created_at,
        created_by: updatedRole.created_by,
        updated_by: updatedRole.updated_by || null,
        modified_at: updatedRole.modified_at,
        created_user: updatedRole.createdBy
          ? `${updatedRole.createdBy.first_name} ${updatedRole.createdBy.last_name}`
          : null,
        updated_user: updatedRole.updatedBy
          ? `${updatedRole.updatedBy.first_name} ${updatedRole.updatedBy.last_name}`
          : null,
        status_name: updatedRole.status ? updatedRole.status.status_name : null,
      };

      return {
        message: `Role ${updatedRole.role_name} successfully toggled to ${newStatusEntity.status_name}.`,
        role: flattenedUpdatedRole,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error(`Failed to toggle status for role with ID ${id}.`);
    }
  }
}
