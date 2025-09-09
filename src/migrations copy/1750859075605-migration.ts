import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750859075605 implements MigrationInterface {
    name = 'Migration1750859075605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`location\` ADD \`region_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`location\` ADD CONSTRAINT \`FK_ab3992c15a52ae2062c349f189d\` FOREIGN KEY (\`region_id\`) REFERENCES \`regions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`location\` DROP FOREIGN KEY \`FK_ab3992c15a52ae2062c349f189d\``);
        await queryRunner.query(`ALTER TABLE \`location\` DROP COLUMN \`region_id\``);
    }

}
