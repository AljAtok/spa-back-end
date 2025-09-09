import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1757423088077 implements MigrationInterface {
    name = 'Migration1757423088077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_auth_access\` ADD \`api_method\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`api_auth_access\` DROP COLUMN \`api_method\``);
    }

}
