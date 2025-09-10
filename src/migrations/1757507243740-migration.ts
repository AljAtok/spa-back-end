import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1757507243740 implements MigrationInterface {
    name = 'Migration1757507243740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD \`assigned_ss\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD \`assigned_ah\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD \`assigned_bch\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD \`assigned_gbch\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD \`assigned_rh\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD \`assigned_grh\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD CONSTRAINT \`FK_b6667436c60c78c976f7181fddf\` FOREIGN KEY (\`assigned_ss\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD CONSTRAINT \`FK_88c7f5dbf539dac3dcd32428294\` FOREIGN KEY (\`assigned_ah\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD CONSTRAINT \`FK_4f899169921d270f21ebbb6d6ce\` FOREIGN KEY (\`assigned_bch\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD CONSTRAINT \`FK_5bc287b0438554d47683385bf16\` FOREIGN KEY (\`assigned_gbch\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD CONSTRAINT \`FK_42ea77a696c18f4d0408ba05cb4\` FOREIGN KEY (\`assigned_rh\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` ADD CONSTRAINT \`FK_ca2d096817b4a4f1bb38a4a7cde\` FOREIGN KEY (\`assigned_grh\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP FOREIGN KEY \`FK_ca2d096817b4a4f1bb38a4a7cde\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP FOREIGN KEY \`FK_42ea77a696c18f4d0408ba05cb4\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP FOREIGN KEY \`FK_5bc287b0438554d47683385bf16\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP FOREIGN KEY \`FK_4f899169921d270f21ebbb6d6ce\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP FOREIGN KEY \`FK_88c7f5dbf539dac3dcd32428294\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP FOREIGN KEY \`FK_b6667436c60c78c976f7181fddf\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP COLUMN \`assigned_grh\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP COLUMN \`assigned_rh\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP COLUMN \`assigned_gbch\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP COLUMN \`assigned_bch\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP COLUMN \`assigned_ah\``);
        await queryRunner.query(`ALTER TABLE \`transaction_details\` DROP COLUMN \`assigned_ss\``);
    }

}
