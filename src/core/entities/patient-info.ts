import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import Base from './dto/base';
import { UserEntity } from './user';

@Entity('patient-info')
export class PatientInfoEntity extends Base {
  @Column()
  birthDate: Date;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  height: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  weight: number;

  @Column()
  bloodType: string;

  @Column()
  sex: 'M' | 'F';

  @Column()
  userId: string;

  @OneToOne(() => UserEntity, (user) => user.patientInfo)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  User: UserEntity;
}
