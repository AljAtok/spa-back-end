import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751351463819 implements MigrationInterface {
    name = 'Migration1751351463819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employees\` ADD \`access_key_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`employees\` ADD CONSTRAINT \`FK_1dc32e1f2e72f6618130c1238d7\` FOREIGN KEY (\`access_key_id\`) REFERENCES \`access_key\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employees\` DROP FOREIGN KEY \`FK_1dc32e1f2e72f6618130c1238d7\``);
        await queryRunner.query(`ALTER TABLE \`employees\` DROP COLUMN \`access_key_id\``);
    }

}
