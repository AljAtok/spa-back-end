import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751272769906 implements MigrationInterface {
    name = 'Migration1751272769906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`warehouse_employees\` (\`id\` int NOT NULL AUTO_INCREMENT, \`warehouse_id\` int NOT NULL, \`assigned_ss\` int NOT NULL, \`assigned_ah\` int NOT NULL, \`assigned_bch\` int NOT NULL, \`assigned_gbch\` int NOT NULL, \`assigned_rh\` int NOT NULL, \`assigned_grh\` int NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_by\` int NULL, UNIQUE INDEX \`IDX_c36311cde57f547fe6585efd25\` (\`warehouse_id\`, \`assigned_ss\`, \`assigned_ah\`, \`assigned_bch\`, \`assigned_gbch\`, \`assigned_rh\`, \`assigned_grh\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_6189a5fd24204591674dea268d9\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_d7591f2bbb09f5267c50e5c9788\` FOREIGN KEY (\`assigned_ss\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_2e7110be30e63505c0f668af802\` FOREIGN KEY (\`assigned_ah\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_36c191b337d7391f2f9c53685e5\` FOREIGN KEY (\`assigned_bch\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_cc77d1886f5a288284b4a3818f9\` FOREIGN KEY (\`assigned_gbch\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_816feb334f97b415c7dcf3e0980\` FOREIGN KEY (\`assigned_rh\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_016cb39465815820de9353863d2\` FOREIGN KEY (\`assigned_grh\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_7e5e25d020b234d6ce8d89eb9ac\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_4d831c2d23d0e9004bce291fe62\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_25fb682d56a31793ba36b439443\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_25fb682d56a31793ba36b439443\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_4d831c2d23d0e9004bce291fe62\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_7e5e25d020b234d6ce8d89eb9ac\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_016cb39465815820de9353863d2\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_816feb334f97b415c7dcf3e0980\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_cc77d1886f5a288284b4a3818f9\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_36c191b337d7391f2f9c53685e5\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_2e7110be30e63505c0f668af802\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_d7591f2bbb09f5267c50e5c9788\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_6189a5fd24204591674dea268d9\``);
        await queryRunner.query(`DROP INDEX \`IDX_c36311cde57f547fe6585efd25\` ON \`warehouse_employees\``);
        await queryRunner.query(`DROP TABLE \`warehouse_employees\``);
    }

}
