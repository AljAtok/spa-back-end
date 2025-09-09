import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751679910786 implements MigrationInterface {
    name = 'Migration1751679910786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employees\` DROP FOREIGN KEY \`FK_0a20efaa3d1b8c73427c3e68dfa\``);
        await queryRunner.query(`CREATE TABLE \`employee_locations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`employee_id\` int NOT NULL, \`location_id\` int NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, UNIQUE INDEX \`IDX_987c2de97dce95b27f52a3eb6a\` (\`employee_id\`, \`location_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`location_id\``);
        await queryRunner.query(`ALTER TABLE \`employee_locations\` ADD CONSTRAINT \`FK_f6a6dfabdbeec12818ff9cf40b9\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_locations\` ADD CONSTRAINT \`FK_72bf5c4e2fdc60b693c086cdf1a\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_locations\` ADD CONSTRAINT \`FK_51d06d477c0421cc1e281511b55\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_locations\` ADD CONSTRAINT \`FK_8390ac97ab19184109fdfc984cf\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_locations\` ADD CONSTRAINT \`FK_8c58d3b87977a173fee38aa9879\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_locations\` DROP FOREIGN KEY \`FK_8c58d3b87977a173fee38aa9879\``);
        await queryRunner.query(`ALTER TABLE \`employee_locations\` DROP FOREIGN KEY \`FK_8390ac97ab19184109fdfc984cf\``);
        await queryRunner.query(`ALTER TABLE \`employee_locations\` DROP FOREIGN KEY \`FK_51d06d477c0421cc1e281511b55\``);
        await queryRunner.query(`ALTER TABLE \`employee_locations\` DROP FOREIGN KEY \`FK_72bf5c4e2fdc60b693c086cdf1a\``);
        await queryRunner.query(`ALTER TABLE \`employee_locations\` DROP FOREIGN KEY \`FK_f6a6dfabdbeec12818ff9cf40b9\``);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`location_id\` int NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_987c2de97dce95b27f52a3eb6a\` ON \`employee_locations\``);
        await queryRunner.query(`DROP TABLE \`employee_locations\``);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD CONSTRAINT \`FK_0a20efaa3d1b8c73427c3e68dfa\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
