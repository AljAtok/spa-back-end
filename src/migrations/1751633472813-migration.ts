import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751633472813 implements MigrationInterface {
    name = 'Migration1751633472813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sales_budget_transactions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`bc_name\` varchar(255) NOT NULL, \`bc_code\` varchar(255) NOT NULL, \`ifs_code\` varchar(255) NOT NULL, \`outlet_name\` varchar(255) NOT NULL, \`sales_det_qty\` decimal(18,2) NOT NULL, \`sales_det_qty_2\` decimal(18,2) NOT NULL, \`sales_month\` int NOT NULL, \`sales_date\` date NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`access_key_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`idx_sales_budget_transactions_sales_month\` (\`sales_month\`), INDEX \`idx_sales_budget_transactions_ifs_code\` (\`ifs_code\`), INDEX \`idx_sales_budget_transactions_bc_code\` (\`bc_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` ADD CONSTRAINT \`FK_cb686e00ce04e1db8c21289072f\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` ADD CONSTRAINT \`FK_69aa171c636b172ec390a233999\` FOREIGN KEY (\`access_key_id\`) REFERENCES \`access_key\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` DROP FOREIGN KEY \`FK_69aa171c636b172ec390a233999\``);
        await queryRunner.query(`ALTER TABLE \`sales_budget_transactions\` DROP FOREIGN KEY \`FK_cb686e00ce04e1db8c21289072f\``);
        await queryRunner.query(`DROP INDEX \`idx_sales_budget_transactions_bc_code\` ON \`sales_budget_transactions\``);
        await queryRunner.query(`DROP INDEX \`idx_sales_budget_transactions_ifs_code\` ON \`sales_budget_transactions\``);
        await queryRunner.query(`DROP INDEX \`idx_sales_budget_transactions_sales_month\` ON \`sales_budget_transactions\``);
        await queryRunner.query(`DROP TABLE \`sales_budget_transactions\``);
    }

}
