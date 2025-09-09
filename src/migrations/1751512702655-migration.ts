import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751512702655 implements MigrationInterface {
    name = 'Migration1751512702655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdles\` CHANGE \`warehouse_rate\` \`warehouse_rate\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_hurdles\` CHANGE \`warehouse_rate\` \`warehouse_rate\` decimal(10,2) NOT NULL`);
    }

}
