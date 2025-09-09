import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751641820290 implements MigrationInterface {
    name = 'Migration1751641820290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` ADD \`material_code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` ADD \`material_desc\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` ADD \`material_group_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`idx_sales_budget_transactions_material_code\` ON \`sales_budget_transactions\` (\`material_code\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`idx_sales_budget_transactions_material_code\` ON \`sales_budget_transactions\``);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` DROP COLUMN \`material_group_name\``);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` DROP COLUMN \`material_desc\``);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` DROP COLUMN \`material_code\``);
    }

}
