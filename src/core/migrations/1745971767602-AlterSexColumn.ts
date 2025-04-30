import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterSexColumn1745971767602 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `patient-info` MODIFY sex VARCHAR(17);');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `patient-info` MODIFY sex VARCHAR(1);');
  }
}
