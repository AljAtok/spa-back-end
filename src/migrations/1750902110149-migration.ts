import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750902110149 implements MigrationInterface {
    name = 'Migration1750902110149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`location\` ADD \`location_abbr\` varchar(20) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`location\` DROP COLUMN \`location_abbr\``);
    }

}
