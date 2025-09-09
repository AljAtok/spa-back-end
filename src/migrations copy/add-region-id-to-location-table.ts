import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRegionIdToLocationTable implements MigrationInterface {
  name = "AddRegionIdToLocationTable";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`location\` ADD COLUMN \`region_id\` int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`location\` ADD CONSTRAINT \`FK_location_region\` FOREIGN KEY (\`region_id\`) REFERENCES \`regions\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`location\` DROP FOREIGN KEY \`FK_location_region\``
    );
    await queryRunner.query(
      `ALTER TABLE \`location\` DROP COLUMN \`region_id\``
    );
  }
}
