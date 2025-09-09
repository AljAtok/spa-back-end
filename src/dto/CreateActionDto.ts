import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  MaxLength,
} from "class-validator";

export class CreateActionDto {
  @IsNotEmpty({ message: "Action name is required" })
  @IsString({ message: "Action name must be a string" })
  @MaxLength(255, {
    message: "Action name cannot be longer than 255 characters",
  }) // Example max length
  action_name!: string;

  @IsOptional() // status_id has a default in entity, but can be provided
  @IsInt({ message: "Status ID must be an integer" })
  status_id?: number;
}
