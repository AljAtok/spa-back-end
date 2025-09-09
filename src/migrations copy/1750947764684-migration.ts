import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750947764684 implements MigrationInterface {
  name = "Migration1750947764684";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`employees\` (\`id\` int NOT NULL AUTO_INCREMENT, \`employee_number\` varchar(255) NOT NULL, \`employee_first_name\` varchar(255) NOT NULL, \`employee_last_name\` varchar(255) NOT NULL, \`employee_email\` varchar(255) NULL, \`location_id\` int NOT NULL, \`position_id\` int NOT NULL, \`status_id\` int NOT NULL DEFAULT '1', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`modified_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`created_by\` int NULL, \`updated_by\` int NULL, UNIQUE INDEX \`IDX_8878710dc844ecd6f9e587f34f\` (\`employee_number\`), UNIQUE INDEX \`IDX_9c2395782886c2c335e94f04a8\` (\`employee_email\`), UNIQUE INDEX \`IDX_4a12bcabf704e1820e9f997704\` (\`employee_number\`, \`employee_first_name\`, \`employee_last_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` ADD CONSTRAINT \`FK_0a20efaa3d1b8c73427c3e68dfa\` FOREIGN KEY (\`location_id\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` ADD CONSTRAINT \`FK_8b14204e8af5e371e36b8c11e1b\` FOREIGN KEY (\`position_id\`) REFERENCES \`positions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` ADD CONSTRAINT \`FK_c4a614082e4e5c9ee4ce0808538\` FOREIGN KEY (\`status_id\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` ADD CONSTRAINT \`FK_43d76ca7eecf9373241e2e890fb\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` ADD CONSTRAINT \`FK_0ab5290751972652ae2786f4bc3\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employees\` DROP FOREIGN KEY \`FK_0ab5290751972652ae2786f4bc3\``
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` DROP FOREIGN KEY \`FK_43d76ca7eecf9373241e2e890fb\``
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` DROP FOREIGN KEY \`FK_c4a614082e4e5c9ee4ce0808538\``
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` DROP FOREIGN KEY \`FK_8b14204e8af5e371e36b8c11e1b\``
    );
    await queryRunner.query(
      `ALTER TABLE \`employees\` DROP FOREIGN KEY \`FK_0a20efaa3d1b8c73427c3e68dfa\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_8878710dc844ecd6f9e587f34f\` ON \`employees\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4a12bcabf704e1820e9f997704\` ON \`employees\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_9c2395782886c2c335e94f04a8\` ON \`employees\``
    );
    // await queryRunner.query(
    //   `DROP INDEX \`IDX_8878710dc844ecd6f9e587f34f\` ON \`employees\``
    // );
    await queryRunner.query(`DROP TABLE \`employees\``);
  }
}
