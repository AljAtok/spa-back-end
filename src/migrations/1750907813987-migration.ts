import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750907813987 implements MigrationInterface {
    name = 'Migration1750907813987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`brand_groups\` (\`id\` int NOT NULL AUTO_INCREMENT, \`brand_group_name\` varchar(255) NOT NULL, \`brand_group_abbr\` varchar(50) NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_by\` int NULL, \`updated_by\` int NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_2bb3502a33a18db3b50615c567\` (\`brand_group_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`brand_groups\` ADD CONSTRAINT \`FK_c8847fe33f1c3a19cd4a9813f9d\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`brand_groups\` ADD CONSTRAINT \`FK_e2d4cb6e32816db9beb0efd7a9f\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`brand_groups\` ADD CONSTRAINT \`FK_8c086574aa134d3d20d639c82ce\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`brand_groups\` DROP FOREIGN KEY \`FK_8c086574aa134d3d20d639c82ce\``);
        await queryRunner.query(`ALTER TABLE \`brand_groups\` DROP FOREIGN KEY \`FK_e2d4cb6e32816db9beb0efd7a9f\``);
        await queryRunner.query(`ALTER TABLE \`brand_groups\` DROP FOREIGN KEY \`FK_c8847fe33f1c3a19cd4a9813f9d\``);
        await queryRunner.query(`DROP INDEX \`IDX_2bb3502a33a18db3b50615c567\` ON \`brand_groups\``);
        await queryRunner.query(`DROP TABLE \`brand_groups\``);
    }

}
