import { IsOptional, IsString, IsEmail, IsInt } from "class-validator";

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  employee_number?: string;

  @IsOptional()
  @IsString()
  employee_first_name?: string;

  @IsOptional()
  @IsString()
  employee_last_name?: string;

  @IsOptional()
  @IsEmail()
  employee_email?: string;

  @IsOptional()
  @IsInt()
  position_id?: number;

  @IsOptional()
  @IsInt()
  status_id?: number;

  @IsOptional()
  @IsInt()
  access_key_id?: number;

  @IsOptional()
  location_ids?: number[];
}
