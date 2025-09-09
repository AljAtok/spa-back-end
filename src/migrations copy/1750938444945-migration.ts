import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750938444945 implements MigrationInterface {
    name = 'Migration1750938444945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_f3f03ba3b150dca3bce90cd4636\` ON \`warehouses\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_85f8156956d961030b0fcba1a78\` FOREIGN KEY (\`segment_id\`) REFERENCES \`segments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_85f8156956d961030b0fcba1a78\``);
        await queryRunner.query(`CREATE INDEX \`FK_f3f03ba3b150dca3bce90cd4636\` ON \`warehouses\` (\`segment_id\`)`);
    }

}
