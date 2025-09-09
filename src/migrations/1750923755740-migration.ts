import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750923755740 implements MigrationInterface {
    name = 'Migration1750923755740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`warehouses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`warehouse_name\` varchar(255) NOT NULL, \`warehouse_ifs\` varchar(100) NOT NULL, \`warehouse_code\` varchar(100) NOT NULL, \`warehouse_type_id\` int NOT NULL, \`location_id\` int NOT NULL, \`brand_id\` int NOT NULL, \`address\` varchar(255) NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_by\` int NULL, \`updated_by\` int NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`UQ_warehouse_name_ifs_code\` (\`warehouse_name\`, \`warehouse_ifs\`, \`warehouse_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_ced6015daa2c3554df9680b2775\` FOREIGN KEY (\`warehouse_type_id\`) REFERENCES \`warehouse_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_722fd6d02489f5eb4094e32cc53\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_f3f03ba3b150dca3bce90cd4636\` FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_c1b1231794838d2a18f14b07788\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_d066c1135d4623a115c3996b7b2\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_3815cccd89efe465d8889590004\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_3815cccd89efe465d8889590004\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_d066c1135d4623a115c3996b7b2\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_c1b1231794838d2a18f14b07788\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_f3f03ba3b150dca3bce90cd4636\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_722fd6d02489f5eb4094e32cc53\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_ced6015daa2c3554df9680b2775\``);
        await queryRunner.query(`DROP INDEX \`UQ_warehouse_name_ifs_code\` ON \`warehouses\``);
        await queryRunner.query(`DROP TABLE \`warehouses\``);
    }

}
