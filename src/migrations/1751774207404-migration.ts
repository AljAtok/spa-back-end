import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751774207404 implements MigrationInterface {
    name = 'Migration1751774207404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD \`budget_volume_monthly\` decimal(18,2) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP COLUMN \`budget_volume_monthly\``);
    }

}
