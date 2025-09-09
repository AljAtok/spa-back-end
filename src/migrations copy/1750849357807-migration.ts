import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750849357807 implements MigrationInterface {
    name = 'Migration1750849357807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`regions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`region_name\` varchar(255) NOT NULL, \`region_abbr\` varchar(50) NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_by\` int NULL, \`updated_by\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4220dc6ab4b5bf97861ef62d9a\` (\`region_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`regions\` ADD CONSTRAINT \`FK_2b3e3b357ff32bfbbf7ceb1ca84\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`regions\` ADD CONSTRAINT \`FK_dbf49b3bbba649c925588d8db6f\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`regions\` ADD CONSTRAINT \`FK_2136f1dbe769b3ee3111ef9be6d\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`regions\` DROP FOREIGN KEY \`FK_2136f1dbe769b3ee3111ef9be6d\``);
        await queryRunner.query(`ALTER TABLE \`regions\` DROP FOREIGN KEY \`FK_dbf49b3bbba649c925588d8db6f\``);
        await queryRunner.query(`ALTER TABLE \`regions\` DROP FOREIGN KEY \`FK_2b3e3b357ff32bfbbf7ceb1ca84\``);
        await queryRunner.query(`DROP INDEX \`IDX_4220dc6ab4b5bf97861ef62d9a\` ON \`regions\``);
        await queryRunner.query(`DROP TABLE \`regions\``);
    }

}
