import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750935944205 implements MigrationInterface {
    name = 'Migration1750935944205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_f3f03ba3b150dca3bce90cd4636\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`brand_id\` \`segment_id\` int NOT NULL`);
        await queryRunner.query(`CREATE TABLE \`segments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`segment_name\` varchar(255) NOT NULL, \`segment_abbr\` varchar(50) NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_by\` int NULL, \`updated_by\` int NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`brand_group_id\` int NULL, UNIQUE INDEX \`IDX_acee2fab55ee87c7b482860c51\` (\`segment_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`brand_groups\` ADD \`segment_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`segments\` ADD CONSTRAINT \`FK_1ddf75e7c3ed494f892d857a92d\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`segments\` ADD CONSTRAINT \`FK_e8861755c92c5cc5a23cfc0a955\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`segments\` ADD CONSTRAINT \`FK_dca5ab8a335e1afa0b336c96fef\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`segments\` ADD CONSTRAINT \`FK_a310d266ff2cdf50274a66c4950\` FOREIGN KEY (\`brand_group_id\`) REFERENCES \`brand_groups\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`brand_groups\` ADD CONSTRAINT \`FK_a445efc69ee6847006d0ddb6260\` FOREIGN KEY (\`segment_id\`) REFERENCES \`segments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_85f8156956d961030b0fcba1a78\` FOREIGN KEY (\`segment_id\`) REFERENCES \`segments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_85f8156956d961030b0fcba1a78\``);
        await queryRunner.query(`ALTER TABLE \`brand_groups\` DROP FOREIGN KEY \`FK_a445efc69ee6847006d0ddb6260\``);
        await queryRunner.query(`ALTER TABLE \`segments\` DROP FOREIGN KEY \`FK_a310d266ff2cdf50274a66c4950\``);
        await queryRunner.query(`ALTER TABLE \`segments\` DROP FOREIGN KEY \`FK_dca5ab8a335e1afa0b336c96fef\``);
        await queryRunner.query(`ALTER TABLE \`segments\` DROP FOREIGN KEY \`FK_e8861755c92c5cc5a23cfc0a955\``);
        await queryRunner.query(`ALTER TABLE \`segments\` DROP FOREIGN KEY \`FK_1ddf75e7c3ed494f892d857a92d\``);
        await queryRunner.query(`ALTER TABLE \`brand_groups\` DROP COLUMN \`segment_id\``);
        await queryRunner.query(`DROP INDEX \`IDX_acee2fab55ee87c7b482860c51\` ON \`segments\``);
        await queryRunner.query(`DROP TABLE \`segments\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`segment_id\` \`brand_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_f3f03ba3b150dca3bce90cd4636\` FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
