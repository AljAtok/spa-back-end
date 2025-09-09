import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751360516267 implements MigrationInterface {
    name = 'Migration1751360516267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD \`access_key_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_3b8a309290d7bc2eac4bc17c412\` FOREIGN KEY (\`access_key_id\`) REFERENCES \`access_key\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_3b8a309290d7bc2eac4bc17c412\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP COLUMN \`access_key_id\``);
    }

}
