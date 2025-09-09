import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751789549297 implements MigrationInterface {
    name = 'Migration1751789549297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` ADD \`from_repo\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` ADD \`created_by\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` ADD \`updated_by\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` ADD CONSTRAINT \`FK_afcdf9f13d9928d5edee5f5b844\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` ADD CONSTRAINT \`FK_bf05c3710acc714626823f180bb\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` DROP FOREIGN KEY \`FK_bf05c3710acc714626823f180bb\``);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` DROP FOREIGN KEY \`FK_afcdf9f13d9928d5edee5f5b844\``);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` DROP COLUMN \`updated_by\``);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` DROP COLUMN \`created_by\``);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` DROP COLUMN \`from_repo\``);
    }

}
