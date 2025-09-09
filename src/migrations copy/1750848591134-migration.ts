import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750848591134 implements MigrationInterface {
    name = 'Migration1750848591134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_user_login_sessions_user_id\` ON \`user_login_sessions\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX \`FK_user_login_sessions_user_id\` ON \`user_login_sessions\` (\`user_id\`)`);
    }

}
