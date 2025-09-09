import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751969579847 implements MigrationInterface {
    name = 'Migration1751969579847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`action_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`module_id\` int NOT NULL, \`ref_id\` int NOT NULL, \`action_id\` int NOT NULL, \`description\` text NOT NULL, \`raw_data\` json NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NOT NULL, \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`action_logs\` ADD CONSTRAINT \`FK_f68ba6889f85450f38b19e817c3\` FOREIGN KEY (\`module_id\`) REFERENCES \`module\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`action_logs\` ADD CONSTRAINT \`FK_307da0fce553735317a257ad42a\` FOREIGN KEY (\`action_id\`) REFERENCES \`action\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`action_logs\` ADD CONSTRAINT \`FK_6008cbd0bb9245521b566ec46e4\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`action_logs\` ADD CONSTRAINT \`FK_9a296fd84764e97cf285f911883\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`action_logs\` ADD CONSTRAINT \`FK_b5478ab465dc816ef25d3d7e085\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`action_logs\` DROP FOREIGN KEY \`FK_b5478ab465dc816ef25d3d7e085\``);
        await queryRunner.query(`ALTER TABLE \`action_logs\` DROP FOREIGN KEY \`FK_9a296fd84764e97cf285f911883\``);
        await queryRunner.query(`ALTER TABLE \`action_logs\` DROP FOREIGN KEY \`FK_6008cbd0bb9245521b566ec46e4\``);
        await queryRunner.query(`ALTER TABLE \`action_logs\` DROP FOREIGN KEY \`FK_307da0fce553735317a257ad42a\``);
        await queryRunner.query(`ALTER TABLE \`action_logs\` DROP FOREIGN KEY \`FK_f68ba6889f85450f38b19e817c3\``);
        await queryRunner.query(`DROP TABLE \`action_logs\``);
    }

}
