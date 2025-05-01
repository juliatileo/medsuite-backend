import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserResetToken1746111433966 implements MigrationInterface {
  private columns = [
    new TableColumn({ name: 'resetToken', type: 'varchar', isNullable: true }),
    new TableColumn({ name: 'resetTokenExpiration', type: 'timestamp', isNullable: true }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(this.columns.map((column) => queryRunner.addColumn('users', column)));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(this.columns.map((column) => queryRunner.dropColumn('users', column)));
  }
}
