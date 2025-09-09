import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750948547115 implements MigrationInterface {
    name = 'Migration1750948547115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`warehouse_hurdles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`warehouse_id\` int NOT NULL, \`warehouse_rate\` decimal(10,2) NOT NULL, \`ss_hurdle_qty\` int NOT NULL, \`hurdle_date\` date NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_by\` int NULL, UNIQUE INDEX \`IDX_0b20dff982c314379331467b9b\` (\`warehouse_id\`, \`hurdle_date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdles\` ADD CONSTRAINT \`FK_c8037d357c8f258f927be842acd\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdles\` ADD CONSTRAINT \`FK_2e5b26d3b44fb677de991292c8a\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdles\` ADD CONSTRAINT \`FK_bfd23b3c5afdd4abda319fb6d27\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdles\` ADD CONSTRAINT \`FK_0cb0bcf46cd6444f6c9450d0742\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdles\` DROP FOREIGN KEY \`FK_0cb0bcf46cd6444f6c9450d0742\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdles\` DROP FOREIGN KEY \`FK_bfd23b3c5afdd4abda319fb6d27\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdles\` DROP FOREIGN KEY \`FK_2e5b26d3b44fb677de991292c8a\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdles\` DROP FOREIGN KEY \`FK_c8037d357c8f258f927be842acd\``);
        await queryRunner.query(`DROP INDEX \`IDX_0b20dff982c314379331467b9b\` ON \`warehouse_hurdles\``);
        await queryRunner.query(`DROP TABLE \`warehouse_hurdles\``);
    }

}
