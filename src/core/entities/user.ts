import { Column, Entity, JoinColumn, ObjectType, OneToMany, OneToOne } from 'typeorm';

import Base from '@entities/dto/base';

import { AppointmentEntity } from './appointment';
import { PatientInfoEntity } from './patient-info';

export enum UserType {
  PATIENT = 1,
  DOCTOR = 2,
}

@Entity('users')
export class UserEntity extends Base {
  @Column({ nullable: false })
  public name: string;

  @Column({ unique: true, nullable: false })
  public cellphone: string;

  @Column({ unique: true, nullable: false })
  public email: string;

  @Column({ nullable: false })
  public password: string;

  @Column({ nullable: false })
  public taxIdentifier: string;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: false,
    default: UserType.PATIENT,
  })
  public type: UserType;

  @Column({ default: false })
  firstAccess: boolean;

  @Column({ type: 'varchar', nullable: true })
  resetToken?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiration?: Date | null;

  @OneToMany(
    (): ObjectType<AppointmentEntity> => AppointmentEntity,
    (appointment: AppointmentEntity): UserEntity => appointment.Patient,
  )
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public patientAppointments: AppointmentEntity[];

  @OneToMany(
    (): ObjectType<AppointmentEntity> => AppointmentEntity,
    (appointment: AppointmentEntity): UserEntity => appointment.Patient,
  )
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public doctorAppointments: AppointmentEntity[];

  @OneToOne(
    (): ObjectType<PatientInfoEntity> => PatientInfoEntity,
    (patientInfo: PatientInfoEntity): UserEntity => patientInfo.User,
  )
  public patientInfo: PatientInfoEntity;
}
