import { IsOptional, IsString, Length, IsNumber } from "class-validator";

export class UpdateRegionDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  region_name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  region_abbr?: string;

  @IsOptional()
  @IsNumber()
  status_id?: number;
}
