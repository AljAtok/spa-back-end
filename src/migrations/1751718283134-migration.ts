import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751718283134 implements MigrationInterface {
    name = 'Migration1751718283134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` ADD \`trans_number\` varchar(32) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction_headers\` DROP COLUMN \`trans_number\``);
    }

}
