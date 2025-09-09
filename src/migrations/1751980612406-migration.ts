import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751980612406 implements MigrationInterface {
    name = 'Migration1751980612406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdles\` ADD \`undo_reason\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdles\` DROP COLUMN \`undo_reason\``);
    }

}
