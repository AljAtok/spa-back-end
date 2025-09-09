import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750946606404 implements MigrationInterface {
  name = "Migration1750946606404";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`positions\` (
    \`id\` int NOT NULL AUTO_INCREMENT,
    \`position_name\` varchar(255) NOT NULL,
    \`position_abbr\` varchar(50) NOT NULL,
    \`status_id\` int NOT NULL DEFAULT '1',
    \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    \`created_by\` int NULL,
    \`updated_by\` int NULL,
    UNIQUE INDEX \`IDX_0bcff1659cc2680566a8af1675\` (\`position_name\`),
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB`
    );

    await queryRunner.query(
      `ALTER TABLE \`positions\` ADD CONSTRAINT \`FK_d5956ebc0dc033f420f2bb7e6ad\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`positions\` ADD CONSTRAINT \`FK_000a467d66ec3c711cf81c38efd\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`positions\` ADD CONSTRAINT \`FK_923b6c2bbeb4fd6cd2c0b14c6c2\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`positions\` DROP FOREIGN KEY \`FK_923b6c2bbeb4fd6cd2c0b14c6c2\``
    );
    await queryRunner.query(
      `ALTER TABLE \`positions\` DROP FOREIGN KEY \`FK_000a467d66ec3c711cf81c38efd\``
    );
    await queryRunner.query(
      `ALTER TABLE \`positions\` DROP FOREIGN KEY \`FK_d5956ebc0dc033f420f2bb7e6ad\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_0bcff1659cc2680566a8af1675\` ON \`positions\``
    );
    // await queryRunner.query(
    //   `DROP INDEX \`IDX_0bcff1659cc2680566a8af1675\` ON \`positions\``
    // );
    await queryRunner.query(`DROP TABLE \`positions\``);
  }
}
