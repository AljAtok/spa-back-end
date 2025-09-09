import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750926328873 implements MigrationInterface {
    name = 'Migration1750926328873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`warehouse_dwh_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`error\` varchar(255) NOT NULL, \`row_data\` text NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`warehouse_dwh_logs\``);
    }

}
