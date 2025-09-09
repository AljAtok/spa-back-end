import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750849037692 implements MigrationInterface {
    name = 'Migration1750849037692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_login_sessions\` ADD CONSTRAINT \`FK_e1e225dce9da11c5b33b525fad7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_login_sessions\` DROP FOREIGN KEY \`FK_e1e225dce9da11c5b33b525fad7\``);
    }

}
