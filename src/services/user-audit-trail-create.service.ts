import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserAuditTrail } from "../entities/UserAuditTrail";
import { CreateUserAuditTrailDto } from "../dto/CreateUserAuditTrailDto";

@Injectable()
export class UserAuditTrailCreateService {
  constructor(
    @InjectRepository(UserAuditTrail)
    private userAuditTrailRepository: Repository<UserAuditTrail>
  ) {}

  async create(
    createDto: CreateUserAuditTrailDto,
    userId: number
  ): Promise<UserAuditTrail> {
    const audit = this.userAuditTrailRepository.create({
      ...createDto,
      created_by: userId,
    });
    try {
      return await this.userAuditTrailRepository.save(audit);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
