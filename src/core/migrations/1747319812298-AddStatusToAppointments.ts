import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusToAppointments1747319812298 implements MigrationInterface {
  private column = new TableColumn({ name: 'status', type: 'integer', isNullable: false });
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('appointments', this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', this.column);
  }
}
