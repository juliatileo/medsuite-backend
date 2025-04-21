import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddPatientInfoTable1745250380054 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'patient-info',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'age',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'height',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'weight',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'bloodType',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sex',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'patient-info',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('patient-info');
    const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('patient-info', foreignKey);
    }
    await queryRunner.dropTable('patient-info');
  }
}
