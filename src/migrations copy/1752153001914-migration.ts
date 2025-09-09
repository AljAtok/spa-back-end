import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752153001914 implements MigrationInterface {
  name = "Migration1752153001914";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop unique index
    await queryRunner.query(
      `ALTER TABLE warehouse_employees DROP INDEX IDX_c36311cde57f547fe6585efd25`
    );
    // Drop foreign keys
    await queryRunner.query(
      `ALTER TABLE warehouse_employees DROP FOREIGN KEY FK_warehouse_employees_assigned_bch`
    );
    await queryRunner.query(
      `ALTER TABLE warehouse_employees DROP FOREIGN KEY FK_warehouse_employees_assigned_rh`
    );
    // Alter columns to nullable
    await queryRunner.query(
      `ALTER TABLE warehouse_employees MODIFY assigned_bch int NULL`
    );
    await queryRunner.query(
      `ALTER TABLE warehouse_employees MODIFY assigned_rh int NULL`
    );
    // Recreate unique index (with nullable columns)
    await queryRunner.query(
      `CREATE UNIQUE INDEX IDX_c36311cde57f547fe6585efd25 ON warehouse_employees (warehouse_id, assigned_ss, assigned_ah, assigned_bch, assigned_gbch, assigned_rh, assigned_grh)`
    );
    // Re-add foreign keys
    await queryRunner.query(
      `ALTER TABLE warehouse_employees ADD CONSTRAINT FK_warehouse_employees_assigned_bch FOREIGN KEY (assigned_bch) REFERENCES employees(id) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE warehouse_employees ADD CONSTRAINT FK_warehouse_employees_assigned_rh FOREIGN KEY (assigned_rh) REFERENCES employees(id) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop unique index
    await queryRunner.query(
      `ALTER TABLE warehouse_employees DROP INDEX IDX_c36311cde57f547fe6585efd25`
    );
    // Drop foreign keys
    await queryRunner.query(
      `ALTER TABLE warehouse_employees DROP FOREIGN KEY FK_warehouse_employees_assigned_bch`
    );
    await queryRunner.query(
      `ALTER TABLE warehouse_employees DROP FOREIGN KEY FK_warehouse_employees_assigned_rh`
    );
    // Alter columns to NOT NULL
    await queryRunner.query(
      `ALTER TABLE warehouse_employees MODIFY assigned_bch int NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE warehouse_employees MODIFY assigned_rh int NOT NULL`
    );
    // Recreate unique index
    await queryRunner.query(
      `CREATE UNIQUE INDEX IDX_c36311cde57f547fe6585efd25 ON warehouse_employees (warehouse_id, assigned_ss, assigned_ah, assigned_bch, assigned_gbch, assigned_rh, assigned_grh)`
    );
    // Re-add foreign keys
    await queryRunner.query(
      `ALTER TABLE warehouse_employees ADD CONSTRAINT FK_warehouse_employees_assigned_bch FOREIGN KEY (assigned_bch) REFERENCES employees(id) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE warehouse_employees ADD CONSTRAINT FK_warehouse_employees_assigned_rh FOREIGN KEY (assigned_rh) REFERENCES employees(id) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
