import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750908141554 implements MigrationInterface {
    name = 'Migration1750908141554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`brands\` ADD \`brand_group_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD CONSTRAINT \`FK_6ec41c3aaad85003bcd9bed7f51\` FOREIGN KEY (\`brand_group_id\`) REFERENCES \`brand_groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`brands\` DROP FOREIGN KEY \`FK_6ec41c3aaad85003bcd9bed7f51\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP COLUMN \`brand_group_id\``);
    }

}
