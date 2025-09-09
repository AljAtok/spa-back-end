import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751363523620 implements MigrationInterface {
    name = 'Migration1751363523620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD \`access_key_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` ADD CONSTRAINT \`FK_db6077a4834ff9582c3c0fb72c8\` FOREIGN KEY (\`access_key_id\`) REFERENCES \`access_key\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP FOREIGN KEY \`FK_db6077a4834ff9582c3c0fb72c8\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_employees\` DROP COLUMN \`access_key_id\``);
    }

}
