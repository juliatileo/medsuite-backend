import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFirstAccessToUser1745765710150 implements MigrationInterface {
  private column = new TableColumn({
    name: 'firstAccess',
    type: 'boolean',
    default: false,
    isNullable: false,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', this.column);
  }
}
