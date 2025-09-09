import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751367068896 implements MigrationInterface {
    name = 'Migration1751367068896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_audit_trail\` ADD \`description\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_audit_trail\` DROP COLUMN \`description\``);
    }

}
