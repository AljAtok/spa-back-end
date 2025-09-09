import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751453204132 implements MigrationInterface {
    name = 'Migration1751453204132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`item_code\` varchar(255) NOT NULL, \`item_name\` varchar(255) NOT NULL, \`item_group\` varchar(255) NOT NULL, \`uom\` varchar(255) NOT NULL, \`uom_sa\` varchar(255) NOT NULL, \`category1_id\` int NULL, \`category2_id\` int NULL, \`sales_conv\` decimal(15,6) NOT NULL, \`sales_unit_eq\` decimal(15,6) NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NOT NULL, \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, UNIQUE INDEX \`IDX_e2ea00bf2ee99ee2eec0d71157\` (\`item_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD CONSTRAINT \`FK_ad4944147c7ca64e5e959165675\` FOREIGN KEY (\`category1_id\`) REFERENCES \`item_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD CONSTRAINT \`FK_5e2d31325b4de341249f5476833\` FOREIGN KEY (\`category2_id\`) REFERENCES \`item_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD CONSTRAINT \`FK_d28ac9db9c3d713877fe5e6fa65\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD CONSTRAINT \`FK_25a958155bb9a9d741210749e07\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD CONSTRAINT \`FK_b93cd2534bcf6e8c06f810b20c6\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_b93cd2534bcf6e8c06f810b20c6\``);
        await queryRunner.query(`ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_25a958155bb9a9d741210749e07\``);
        await queryRunner.query(`ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_d28ac9db9c3d713877fe5e6fa65\``);
        await queryRunner.query(`ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_5e2d31325b4de341249f5476833\``);
        await queryRunner.query(`ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_ad4944147c7ca64e5e959165675\``);
        await queryRunner.query(`DROP INDEX \`IDX_e2ea00bf2ee99ee2eec0d71157\` ON \`items\``);
        await queryRunner.query(`DROP TABLE \`items\``);
    }

}
