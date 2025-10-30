import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1761809733308 implements MigrationInterface {
    name = 'Migration1761809733308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD \`rem_status_id\` int NOT NULL DEFAULT '8'`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_763a2ecf138034af11053a9a72d\` FOREIGN KEY (\`rem_status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_763a2ecf138034af11053a9a72d\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP COLUMN \`rem_status_id\``);
    }

}
