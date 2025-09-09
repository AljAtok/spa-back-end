import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751881695758 implements MigrationInterface {
    name = 'Migration1751881695758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` ADD \`cancel_reason\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` ADD \`undo_reason\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` DROP COLUMN \`undo_reason\``);
        await queryRunner.query(`ALTER TABLE \`sales_transactions\` DROP COLUMN \`cancel_reason\``);
    }

}
