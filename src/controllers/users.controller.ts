import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
  Patch,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { CreateUserDto } from "../dto/CreateUserDto";
import { UpdateUserDto } from "../dto/UpdateUserDto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RequirePermissions } from "src/decorators/permissions.decorator";
import { PermissionsGuard } from "src/guards/permissions.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import * as fs from "fs";
import * as bcrypt from "bcrypt";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: "USERS", action: "VIEW" })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get("nested")
  // @RequirePermissions({ module: "USERS", action: "VIEW" })
  async nested() {
    return this.usersService.nested();
  }

  @Get("nested/:user_id")
  // @RequirePermissions({ module: "USERS", action: "VIEW" })
  async nestedByUser(@Param("user_id", ParseIntPipe) user_id: number) {
    return this.usersService.nestedByUser(user_id);
  }

  @Get("nested-per-access-key/:user_id")
  // @RequirePermissions({ module: "USERS", action: "VIEW" })
  async nestedByUserAccessKey(@Param("user_id", ParseIntPipe) user_id: number) {
    return this.usersService.nestedByUserAccessKey(user_id);
  }

  @Get("info/:role_id")
  // @RequirePermissions({ module: "USERS", action: "VIEW" })
  async findUserBasic(@Param("role_id", ParseIntPipe) role_id: number) {
    return this.usersService.findUsersBasic({ role_id: role_id });
  }

  @Get(":id")
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: "USERS", action: "VIEW" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: "USERS", action: "ADD" })
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    createUserDto.created_by = req.user.id;
    return this.usersService.create(createUserDto);
  }

  @Put(":id")
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: "USERS", action: "EDIT" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req
  ) {
    updateUserDto.updated_by = req.user.id;
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: "USERS", action: "DELETE" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch(":id/toggle-status-activate")
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: "USERS", action: "ACTIVATE" })
  async toggleStatusActivate(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ) {
    return this.usersService.toggleStatus(id, req.user.id);
  }

  @Patch(":id/toggle-status-deactivate")
  @UseGuards(PermissionsGuard)
  @RequirePermissions({ module: "USERS", action: "DEACTIVATE" })
  async toggleStatusDeactivate(
    @Param("id", ParseIntPipe) id: number,
    @Request() req
  ) {
    return this.usersService.toggleStatus(id, req.user.id);
  }

  @Post(":id/profile-picture")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dir = "./uploads/profile_pics";
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 4 * 1024 * 1024 }, // 4MB
    })
  )
  async uploadProfilePicture(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    if (!file)
      throw new BadRequestException("No file uploaded or invalid file type.");
    // Save the file path as a URL
    const url = `/uploads/profile_pics/${file.filename}`;
    await this.usersService.update(id, {
      profile_pic_url: url,
      updated_by: req.user.id,
    });
    return { profile_pic_url: url };
  }

  @Put(":user_id/password")
  async updatePassword(
    @Param("user_id", ParseIntPipe) user_id: number,
    @Body() body: { current_password: string; new_password: string },
    @Request() req
  ) {
    if (
      !body.current_password ||
      !body.new_password ||
      body.new_password.length < 8
    ) {
      throw new BadRequestException(
        "Current and new password required. New password must be at least 8 characters."
      );
    }
    // Get user from DB (raw entity, not flattened)
    const user = await this.usersService.findUserById(user_id);
    if (!user) throw new BadRequestException("User not found.");
    // Check current password
    const match = await bcrypt.compare(body.current_password, user.password);
    if (!match) throw new BadRequestException("Current password is incorrect.");
    // Only pass new_password to service, which will hash it
    await this.usersService.update(user_id, {
      password: body.new_password,
      updated_by: req.user.id,
    });
    return { message: "Password updated." };
  }

  @Put(":user_id/change-temp-password")
  async updateTempPassword(
    @Param("user_id", ParseIntPipe) user_id: number,
    @Body() body: { new_password: string },
    @Request() req
  ) {
    if (body.new_password.length < 8) {
      throw new BadRequestException(
        "Current and new password required. New password must be at least 8 characters."
      );
    }
    // Get user from DB (raw entity, not flattened)
    const user = await this.usersService.findUserById(user_id);
    if (!user) throw new BadRequestException("User not found.");

    // Only pass new_password to service, which will hash it
    await this.usersService.update(user_id, {
      password: body.new_password,
      user_reset: false,
      updated_by: req.user.id,
    });
    return {
      message:
        "Temporary Password updated. Please re-login with your new password.",
    };
  }

  @Put(":user_id/reset-password")
  async resetPassword(
    @Param("user_id", ParseIntPipe) user_id: number,
    @Body() body: { password: string },
    @Request() req
  ) {
    if (!body.password || body.password.length < 6) {
      throw new BadRequestException(
        "New password must be at least 6 characters."
      );
    }
    // Get user from DB (raw entity, not flattened)
    const user = await this.usersService.findUserById(user_id);
    if (!user) throw new BadRequestException("User not found.");
    const email = user.email;
    const firstName = user.first_name || "User";
    const lastName = user.last_name || "";
    // Only pass new_password to service, which will hash it
    const updateResult = await this.usersService.update(user_id, {
      password: body.password,
      user_reset: true,
      updated_by: req.user.id,
    });
    if (!updateResult || updateResult instanceof Error) {
      throw new BadRequestException("Failed to reset password.");
    }

    await this.usersService.send_reset_email(
      email,
      firstName,
      lastName,
      body.password,
      req.user.id
    );
    return { message: "Password reset successfully." };
  }

  @Put(":user_id/profile")
  async updateProfile(
    @Param("user_id", ParseIntPipe) user_id: number,
    @Body() body: { first_name: string; last_name: string },
    @Request() req
  ) {
    if (!body.first_name || !body.last_name) {
      throw new BadRequestException("First name and last name are required.");
    }
    await this.usersService.update(user_id, {
      first_name: body.first_name,
      last_name: body.last_name,
      updated_by: req.user.id,
    });
    return { message: "Profile updated." };
  }

  @Post("/test-email")
  async testEmail(
    @Body()
    body: {
      email: string;
      first_name: string;
      last_name: string;
      password: string;
    }
  ) {
    if (!body.first_name || !body.last_name) {
      throw new BadRequestException("First name and last name are required.");
    }
    await this.usersService.test_email(
      body.email,
      body.first_name,
      body.last_name,
      body.password
    );
    return { message: "Test email sent." };
  }

  @Post("upload-excel")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/users",
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/i)) {
          return cb(new Error("Only Excel files are allowed!"), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 8 * 1024 * 1024 },
    })
  )
  async uploadExcelUsers(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    if (!file)
      throw new BadRequestException("No file uploaded or invalid file type.");
    return this.usersService.uploadExcelUsers(
      file.path,
      req.user.id,
      req.user.role_id,
      req.user.role.role_level
    );
  }
}
