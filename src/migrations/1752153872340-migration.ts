import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752153872340 implements MigrationInterface {
    name = 'Migration1752153872340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_36c191b337d7391f2f9c53685e5\` FOREIGN KEY (\`assigned_bch\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_816feb334f97b415c7dcf3e0980\` FOREIGN KEY (\`assigned_rh\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_816feb334f97b415c7dcf3e0980\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_36c191b337d7391f2f9c53685e5\``);
    }

}
