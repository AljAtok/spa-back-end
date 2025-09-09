import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750906394460 implements MigrationInterface {
    name = 'Migration1750906394460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`brands\` (\`id\` int NOT NULL AUTO_INCREMENT, \`brand_name\` varchar(255) NOT NULL, \`brand_abbr\` varchar(50) NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_by\` int NULL, \`updated_by\` int NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_35be08736e06a8462e65a9ee7c\` (\`brand_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD CONSTRAINT \`FK_721e90e94934bffe34edbc8b66f\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD CONSTRAINT \`FK_43291261334c16b47ff227c09ff\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD CONSTRAINT \`FK_82287aa27f24ffd617a658c2a97\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`brands\` DROP FOREIGN KEY \`FK_82287aa27f24ffd617a658c2a97\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP FOREIGN KEY \`FK_43291261334c16b47ff227c09ff\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP FOREIGN KEY \`FK_721e90e94934bffe34edbc8b66f\``);
        await queryRunner.query(`DROP INDEX \`IDX_35be08736e06a8462e65a9ee7c\` ON \`brands\``);
        await queryRunner.query(`DROP TABLE \`brands\``);
    }

}
