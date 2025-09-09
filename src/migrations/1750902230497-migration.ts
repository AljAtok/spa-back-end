import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750902230497 implements MigrationInterface {
    name = 'Migration1750902230497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`location\` CHANGE \`location_code\` \`location_code\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`location\` ADD UNIQUE INDEX \`IDX_e2769051a458c233a2856be320\` (\`location_code\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`location\` DROP INDEX \`IDX_e2769051a458c233a2856be320\``);
        await queryRunner.query(`ALTER TABLE \`location\` CHANGE \`location_code\` \`location_code\` varchar(50) NULL`);
    }

}
