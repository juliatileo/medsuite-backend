import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import Base from './dto/base';
import { UserEntity } from './user';

@Entity('patient-info')
export class PatientInfoEntity extends Base {
  @Column()
  birthDate: Date;

  @Column()
  height: number;

  @Column('float', { precision: 6, scale: 2 })
  weight: number;

  @Column('float', { precision: 6, scale: 2 })
  bloodType: string;

  @Column()
  sex: 'M' | 'F';

  @Column()
  userId: string;

  @OneToOne(() => UserEntity, (user) => user.patientInfo)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  User: UserEntity;
}
