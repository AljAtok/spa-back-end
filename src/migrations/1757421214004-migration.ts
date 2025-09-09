import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1757421214004 implements MigrationInterface {
    name = 'Migration1757421214004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`api_keys\` (\`id\` int NOT NULL AUTO_INCREMENT, \`api_keys\` varchar(255) NOT NULL, \`level\` int NOT NULL, \`ignore_limits\` tinyint NOT NULL DEFAULT '1', \`is_private_key\` tinyint NOT NULL DEFAULT '1', \`ip_address\` varchar(45) NULL, \`status_id\` int NOT NULL, \`access_key_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NOT NULL, \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`api_auth_access\` (\`id\` int NOT NULL AUTO_INCREMENT, \`api_key_id\` int NOT NULL, \`all_access\` tinyint NOT NULL DEFAULT '1', \`controller_url\` varchar(255) NOT NULL, \`status_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NOT NULL, \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`api_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uri\` varchar(255) NOT NULL, \`method\` varchar(6) NOT NULL, \`params\` text NULL, \`api_key_id\` int NULL, \`ip_address\` varchar(45) NULL, \`time\` datetime NOT NULL, \`authorized\` tinyint NULL, \`response_code\` int NULL, \`status_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`api_keys\` ADD CONSTRAINT \`FK_c3dfa56d81eee880d0da7b43e62\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`api_keys\` ADD CONSTRAINT \`FK_4e04ee957e2924b41adf098b112\` FOREIGN KEY (\`access_key_id\`) REFERENCES \`access_key\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`api_keys\` ADD CONSTRAINT \`FK_983d7eb19ca94bb8e343293068e\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`api_keys\` ADD CONSTRAINT \`FK_153c03b51f6af22b2c7491cc02e\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`api_auth_access\` ADD CONSTRAINT \`FK_77c13fa50c244d08fb9f82134ad\` FOREIGN KEY (\`api_key_id\`) REFERENCES \`api_keys\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`api_auth_access\` ADD CONSTRAINT \`FK_f9437bc6e2477c0eb352ee70abc\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`api_auth_access\` ADD CONSTRAINT \`FK_ac484584caf192f15ac249964a6\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`api_auth_access\` ADD CONSTRAINT \`FK_0fb13bf6c1dabd8e864e23cb067\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`api_logs\` ADD CONSTRAINT \`FK_015e858e73317dd35c68ffec99c\` FOREIGN KEY (\`api_key_id\`) REFERENCES \`api_keys\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`api_logs\` ADD CONSTRAINT \`FK_2f526adc7c622e5a869429bea6a\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_logs\` DROP FOREIGN KEY \`FK_2f526adc7c622e5a869429bea6a\``);
        await queryRunner.query(`ALTER TABLE \`api_logs\` DROP FOREIGN KEY \`FK_015e858e73317dd35c68ffec99c\``);
        await queryRunner.query(`ALTER TABLE \`api_auth_access\` DROP FOREIGN KEY \`FK_0fb13bf6c1dabd8e864e23cb067\``);
        await queryRunner.query(`ALTER TABLE \`api_auth_access\` DROP FOREIGN KEY \`FK_ac484584caf192f15ac249964a6\``);
        await queryRunner.query(`ALTER TABLE \`api_auth_access\` DROP FOREIGN KEY \`FK_f9437bc6e2477c0eb352ee70abc\``);
        await queryRunner.query(`ALTER TABLE \`api_auth_access\` DROP FOREIGN KEY \`FK_77c13fa50c244d08fb9f82134ad\``);
        await queryRunner.query(`ALTER TABLE \`api_keys\` DROP FOREIGN KEY \`FK_153c03b51f6af22b2c7491cc02e\``);
        await queryRunner.query(`ALTER TABLE \`api_keys\` DROP FOREIGN KEY \`FK_983d7eb19ca94bb8e343293068e\``);
        await queryRunner.query(`ALTER TABLE \`api_keys\` DROP FOREIGN KEY \`FK_4e04ee957e2924b41adf098b112\``);
        await queryRunner.query(`ALTER TABLE \`api_keys\` DROP FOREIGN KEY \`FK_c3dfa56d81eee880d0da7b43e62\``);
        await queryRunner.query(`DROP TABLE \`api_logs\``);
        await queryRunner.query(`DROP TABLE \`api_auth_access\``);
        await queryRunner.query(`DROP TABLE \`api_keys\``);
    }

}
