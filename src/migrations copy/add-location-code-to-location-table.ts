import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocationCodeToLocationTable implements MigrationInterface {
  name = "AddLocationCodeToLocationTable";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`location\` ADD COLUMN \`location_code\` varchar(50) UNIQUE NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`location\` DROP COLUMN \`location_code\``
    );
  }
}
