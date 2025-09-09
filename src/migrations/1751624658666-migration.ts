import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751624658666 implements MigrationInterface {
    name = 'Migration1751624658666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sales_transactions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`doc_date\` date NOT NULL, \`doc_date_month\` int NOT NULL, \`bc_code\` varchar(255) NOT NULL, \`division\` varchar(255) NOT NULL, \`whs_code\` varchar(255) NOT NULL, \`whs_name\` varchar(255) NOT NULL, \`dchannel\` varchar(255) NOT NULL, \`item_code\` varchar(255) NOT NULL, \`item_desc\` varchar(255) NOT NULL, \`vat_cdoe\` varchar(255) NOT NULL, \`gross_sales\` decimal(18,6) NOT NULL, \`net_sales\` decimal(18,6) NOT NULL, \`quantity\` decimal(18,6) NOT NULL, \`converted_quantity\` decimal(18,6) NOT NULL, \`line_total\` decimal(18,6) NOT NULL, \`unit_price\` decimal(18,6) NOT NULL, \`vat_amount\` decimal(18,6) NOT NULL, \`line_cost\` decimal(18,6) NOT NULL, \`item_cost\` decimal(18,6) NOT NULL, \`disc_amount\` decimal(18,6) NOT NULL, \`vat_rate\` decimal(18,6) NOT NULL, \`cat01\` varchar(255) NOT NULL, \`cat02\` varchar(255) NOT NULL, \`sales_conv\` decimal(18,6) NOT NULL, \`sales_unit_eq\` int NOT NULL, \`item_group\` varchar(255) NOT NULL, \`uom\` varchar(255) NOT NULL, \`access_key_id\` int NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`idx_sales_transactions_sales_unit_eq\` (\`sales_unit_eq\`), INDEX \`idx_sales_transactions_sales_conv\` (\`sales_conv\`), INDEX \`idx_sales_transactions_cat02\` (\`cat02\`), INDEX \`idx_sales_transactions_cat01\` (\`cat01\`), INDEX \`idx_sales_transactions_bc_code\` (\`bc_code\`), INDEX \`idx_sales_transactions_whs_code\` (\`whs_code\`), INDEX \`idx_sales_transactions_item_code\` (\`item_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` ADD CONSTRAINT \`FK_53c908aaccfdd124bdd76e2f0e3\` FOREIGN KEY (\`access_key_id\`) REFERENCES \`access_key\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` ADD CONSTRAINT \`FK_4d6326fb77d47160e64b65a42bf\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` DROP FOREIGN KEY \`FK_4d6326fb77d47160e64b65a42bf\``);
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` DROP FOREIGN KEY \`FK_53c908aaccfdd124bdd76e2f0e3\``);
        await queryRunner.query(`DROP INDEX \`idx_sales_transactions_item_code\` ON \`sales_transactions\``);
        await queryRunner.query(`DROP INDEX \`idx_sales_transactions_whs_code\` ON \`sales_transactions\``);
        await queryRunner.query(`DROP INDEX \`idx_sales_transactions_bc_code\` ON \`sales_transactions\``);
        await queryRunner.query(`DROP INDEX \`idx_sales_transactions_cat01\` ON \`sales_transactions\``);
        await queryRunner.query(`DROP INDEX \`idx_sales_transactions_cat02\` ON \`sales_transactions\``);
        await queryRunner.query(`DROP INDEX \`idx_sales_transactions_sales_conv\` ON \`sales_transactions\``);
        await queryRunner.query(`DROP INDEX \`idx_sales_transactions_sales_unit_eq\` ON \`sales_transactions\``);
        await queryRunner.query(`DROP TABLE \`sales_transactions\``);
    }

}
