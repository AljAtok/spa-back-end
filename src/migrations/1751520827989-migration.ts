import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751520827989 implements MigrationInterface {
    name = 'Migration1751520827989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`warehouse_hurdle_categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`warehouse_id\` int NOT NULL, \`item_category_id\` int NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`warehouse_hurdle_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdle_categories\` ADD CONSTRAINT \`FK_8b70cb8f12c415a5f6dd867edfb\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdle_categories\` ADD CONSTRAINT \`FK_57eb020a641c3ba0aa3e7d11b56\` FOREIGN KEY (\`item_category_id\`) REFERENCES \`item_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdle_categories\` ADD CONSTRAINT \`FK_41d681e26ee94a9a4c074c58c7c\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdle_categories\` ADD CONSTRAINT \`FK_af602902512ba4d304cca2b71fc\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdle_categories\` ADD CONSTRAINT \`FK_525fa296b6aa4659f0eb4f5889b\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdle_categories\` ADD CONSTRAINT \`FK_23e5c6a6c894af251506b7be20b\` FOREIGN KEY (\`warehouse_hurdle_id\`) REFERENCES \`warehouse_hurdles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdle_categories\` DROP FOREIGN KEY \`FK_23e5c6a6c894af251506b7be20b\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdle_categories\` DROP FOREIGN KEY \`FK_525fa296b6aa4659f0eb4f5889b\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdle_categories\` DROP FOREIGN KEY \`FK_af602902512ba4d304cca2b71fc\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdle_categories\` DROP FOREIGN KEY \`FK_41d681e26ee94a9a4c074c58c7c\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdle_categories\` DROP FOREIGN KEY \`FK_57eb020a641c3ba0aa3e7d11b56\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdle_categories\` DROP FOREIGN KEY \`FK_8b70cb8f12c415a5f6dd867edfb\``);
        await queryRunner.query(`DROP TABLE \`warehouse_hurdle_categories\``);
    }

}
