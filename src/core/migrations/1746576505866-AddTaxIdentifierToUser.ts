import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTaxIdentifierToUser1746576505866 implements MigrationInterface {
  private column = new TableColumn({ name: 'taxIdentifier', type: 'varchar', isNullable: false });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', this.column);
  }
}
