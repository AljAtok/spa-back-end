import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751450324314 implements MigrationInterface {
    name = 'Migration1751450324314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`item_category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`level\` int NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`created_by\` int NOT NULL, \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, UNIQUE INDEX \`IDX_d07bbc72c8822787efab782a6c\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`item_category\` ADD CONSTRAINT \`FK_4f1d4bc21855ee7d0a9efa9c276\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`item_category\` ADD CONSTRAINT \`FK_77de63b7295dd42368ccaa86b7b\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`item_category\` ADD CONSTRAINT \`FK_656207ca43291f5a56f00f6baed\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`item_category\` DROP FOREIGN KEY \`FK_656207ca43291f5a56f00f6baed\``);
        await queryRunner.query(`ALTER TABLE \`item_category\` DROP FOREIGN KEY \`FK_77de63b7295dd42368ccaa86b7b\``);
        await queryRunner.query(`ALTER TABLE \`item_category\` DROP FOREIGN KEY \`FK_4f1d4bc21855ee7d0a9efa9c276\``);
        await queryRunner.query(`DROP INDEX \`IDX_d07bbc72c8822787efab782a6c\` ON \`item_category\``);
        await queryRunner.query(`DROP TABLE \`item_category\``);
    }

}
