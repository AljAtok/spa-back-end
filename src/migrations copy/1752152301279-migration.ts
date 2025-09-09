import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752152301279 implements MigrationInterface {
    name = 'Migration1752152301279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_36c191b337d7391f2f9c53685e5\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_816feb334f97b415c7dcf3e0980\``);
        await queryRunner.query(`DROP INDEX \`IDX_c36311cde57f547fe6585efd25\` ON \`warehouse_employees\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` CHANGE \`assigned_bch\` \`assigned_bch\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` CHANGE \`assigned_rh\` \`assigned_rh\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c36311cde57f547fe6585efd25\` ON \`warehouse_employees\` (\`warehouse_id\`, \`assigned_ss\`, \`assigned_ah\`, \`assigned_bch\`, \`assigned_gbch\`, \`assigned_rh\`, \`assigned_grh\`)`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_36c191b337d7391f2f9c53685e5\` FOREIGN KEY (\`assigned_bch\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_816feb334f97b415c7dcf3e0980\` FOREIGN KEY (\`assigned_rh\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_816feb334f97b415c7dcf3e0980\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_36c191b337d7391f2f9c53685e5\``);
        await queryRunner.query(`DROP INDEX \`IDX_c36311cde57f547fe6585efd25\` ON \`warehouse_employees\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` CHANGE \`assigned_rh\` \`assigned_rh\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` CHANGE \`assigned_bch\` \`assigned_bch\` int NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c36311cde57f547fe6585efd25\` ON \`warehouse_employees\` (\`warehouse_id\`, \`assigned_ss\`, \`assigned_ah\`, \`assigned_bch\`, \`assigned_gbch\`, \`assigned_rh\`, \`assigned_grh\`)`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_816feb334f97b415c7dcf3e0980\` FOREIGN KEY (\`assigned_rh\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_36c191b337d7391f2f9c53685e5\` FOREIGN KEY (\`assigned_bch\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
