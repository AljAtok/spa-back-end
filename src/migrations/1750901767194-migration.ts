import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750901767194 implements MigrationInterface {
    name = 'Migration1750901767194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`location\` ADD \`location_code\` varchar(50) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`location\` DROP COLUMN \`location_code\``);
    }

}
