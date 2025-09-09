import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751549171034 implements MigrationInterface {
    name = 'Migration1751549171034'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`warehouse_rates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`warehouse_id\` int NOT NULL, \`warehouse_rate\` decimal(10,2) NOT NULL, \`status_id\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NOT NULL, \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`warehouse_rates\` ADD CONSTRAINT \`FK_dcfd10c5bb69334e7b023ce73bb\` FOREIGN KEY (\`warehouse_id\`) REFERENCES \`warehouses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_rates\` ADD CONSTRAINT \`FK_385c7fbe507aa2997e3464f4216\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_rates\` ADD CONSTRAINT \`FK_55ee8a92edd731eecaac0df5262\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_rates\` ADD CONSTRAINT \`FK_95a22c1a8145c3aecb07203d691\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_rates\` DROP FOREIGN KEY \`FK_95a22c1a8145c3aecb07203d691\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_rates\` DROP FOREIGN KEY \`FK_55ee8a92edd731eecaac0df5262\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_rates\` DROP FOREIGN KEY \`FK_385c7fbe507aa2997e3464f4216\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_rates\` DROP FOREIGN KEY \`FK_dcfd10c5bb69334e7b023ce73bb\``);
        await queryRunner.query(`DROP TABLE \`warehouse_rates\``);
    }

}
