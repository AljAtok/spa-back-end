import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751366739219 implements MigrationInterface {
    name = 'Migration1751366739219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_audit_trail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`service\` varchar(255) NOT NULL, \`method\` varchar(255) NOT NULL, \`raw_data\` text NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_audit_trail\` ADD CONSTRAINT \`FK_e93990f3dc3122b08eba645f72b\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_audit_trail\` ADD CONSTRAINT \`FK_9eef3529359f406f308b42de5d4\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_audit_trail\` DROP FOREIGN KEY \`FK_9eef3529359f406f308b42de5d4\``);
        await queryRunner.query(`ALTER TABLE \`user_audit_trail\` DROP FOREIGN KEY \`FK_e93990f3dc3122b08eba645f72b\``);
        await queryRunner.query(`DROP TABLE \`user_audit_trail\``);
    }

}
