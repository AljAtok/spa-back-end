import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750911881178 implements MigrationInterface {
    name = 'Migration1750911881178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`warehouse_types\` (\`id\` int NOT NULL AUTO_INCREMENT, \`warehouse_type_name\` varchar(255) NOT NULL, \`warehouse_type_abbr\` varchar(50) NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_by\` int NULL, \`updated_by\` int NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a017db66de6973e2c99621e861\` (\`warehouse_type_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`warehouse_types\` ADD CONSTRAINT \`FK_99cc5322993a68b0a7907d6b87b\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_types\` ADD CONSTRAINT \`FK_59aaf97d14c1eceb27761406ffd\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouse_types\` ADD CONSTRAINT \`FK_79dabe668dee11132c66a6791f0\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouse_types\` DROP FOREIGN KEY \`FK_79dabe668dee11132c66a6791f0\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_types\` DROP FOREIGN KEY \`FK_59aaf97d14c1eceb27761406ffd\``);
        await queryRunner.query(`ALTER TABLE \`warehouse_types\` DROP FOREIGN KEY \`FK_99cc5322993a68b0a7907d6b87b\``);
        await queryRunner.query(`DROP INDEX \`IDX_a017db66de6973e2c99621e861\` ON \`warehouse_types\``);
        await queryRunner.query(`DROP TABLE \`warehouse_types\``);
    }

}
