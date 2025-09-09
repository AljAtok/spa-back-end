import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751882881644 implements MigrationInterface {
    name = 'Migration1751882881644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` ADD \`cancel_reason\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` ADD \`undo_reason\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` DROP COLUMN \`undo_reason\``);
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` DROP COLUMN \`cancel_reason\``);
    }

}
