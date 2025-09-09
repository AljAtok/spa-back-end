import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751639041055 implements MigrationInterface {
    name = 'Migration1751639041055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`transaction_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`transaction_header_id\` int NOT NULL, \`warehouse_id\` int NOT NULL, \`budget_volume\` decimal(18,2) NOT NULL, \`ss_hurdle_qty\` decimal(18,2) NOT NULL, \`sales_qty\` decimal(18,6) NOT NULL, \`rate\` decimal(18,2) NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transaction_headers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`trans_date\` date NOT NULL, \`location_id\` int NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`access_key_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD CONSTRAINT \`FK_dad922ecf39b08cb70f01cc6690\` FOREIGN KEY (\`transaction_header_id\`) REFERENCES \`transaction_headers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD CONSTRAINT \`FK_5bc126d3c4d785d5beee5ed70b7\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD CONSTRAINT \`FK_b0891c80ebc273677dd0f34d5c4\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` ADD CONSTRAINT \`FK_da855814756945bf2a9956fa53e\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` ADD CONSTRAINT \`FK_967e5dd13f14b4e1d80b13cb80f\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` ADD CONSTRAINT \`FK_0f7cf15b8d887ca3e0bcf8df2e1\` FOREIGN KEY (\`access_key_id\`) REFERENCES \`access_key\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` ADD CONSTRAINT \`FK_3cc01458444d19e1dac74f1f5bb\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` ADD CONSTRAINT \`FK_d7ce514053d14487b72bd356383\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` DROP FOREIGN KEY \`FK_d7ce514053d14487b72bd356383\``);
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` DROP FOREIGN KEY \`FK_3cc01458444d19e1dac74f1f5bb\``);
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` DROP FOREIGN KEY \`FK_0f7cf15b8d887ca3e0bcf8df2e1\``);
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` DROP FOREIGN KEY \`FK_967e5dd13f14b4e1d80b13cb80f\``);
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` DROP FOREIGN KEY \`FK_da855814756945bf2a9956fa53e\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP FOREIGN KEY \`FK_b0891c80ebc273677dd0f34d5c4\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP FOREIGN KEY \`FK_5bc126d3c4d785d5beee5ed70b7\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP FOREIGN KEY \`FK_dad922ecf39b08cb70f01cc6690\``);
        await queryRunner.query(`DROP TABLE \`transaction_headers\``);
        await queryRunner.query(`DROP TABLE \`transaction_details\``);
    }

}
