import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751281251730 implements MigrationInterface {
    name = 'Migration1751281251730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_cc77d1886f5a288284b4a3818f9\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_016cb39465815820de9353863d2\``);
        await queryRunner.query(`DROP INDEX \`IDX_c36311cde57f547fe6585efd25\` ON \`warehouse_employees\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` CHANGE \`assigned_gbch\` \`assigned_gbch\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` CHANGE \`assigned_grh\` \`assigned_grh\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c36311cde57f547fe6585efd25\` ON \`warehouse_employees\` (\`warehouse_id\`, \`assigned_ss\`, \`assigned_ah\`, \`assigned_bch\`, \`assigned_gbch\`, \`assigned_rh\`, \`assigned_grh\`)`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_cc77d1886f5a288284b4a3818f9\` FOREIGN KEY (\`assigned_gbch\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_016cb39465815820de9353863d2\` FOREIGN KEY (\`assigned_grh\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_016cb39465815820de9353863d2\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_cc77d1886f5a288284b4a3818f9\``);
        await queryRunner.query(`DROP INDEX \`IDX_c36311cde57f547fe6585efd25\` ON \`warehouse_employees\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` CHANGE \`assigned_grh\` \`assigned_grh\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` CHANGE \`assigned_gbch\` \`assigned_gbch\` int NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c36311cde57f547fe6585efd25\` ON \`warehouse_employees\` (\`warehouse_id\`, \`assigned_ss\`, \`assigned_ah\`, \`assigned_bch\`, \`assigned_gbch\`, \`assigned_rh\`, \`assigned_grh\`)`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_016cb39465815820de9353863d2\` FOREIGN KEY (\`assigned_grh\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_cc77d1886f5a288284b4a3818f9\` FOREIGN KEY (\`assigned_gbch\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
