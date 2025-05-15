import { Column, Entity, JoinColumn, ManyToOne, ObjectType } from 'typeorm';

import Base from './dto/base';
import { UserEntity } from './user';

export enum AppointmentStatus {
  SCHEDULED = 1,
  CANCELED = 2,
  PENDING_DONE = 4,
  DONE = 3,
}

@Entity('appointments')
export class AppointmentEntity extends Base {
  @Column()
  date: Date;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: AppointmentStatus })
  status: AppointmentStatus;

  @Column()
  patientId: string;

  @Column()
  doctorId: string;

  @ManyToOne(
    (): ObjectType<UserEntity> => UserEntity,
    (patient: UserEntity): AppointmentEntity[] => patient.patientAppointments,
  )
  @JoinColumn({ name: 'patientId', referencedColumnName: 'id' })
  public Patient: UserEntity;

  @ManyToOne(
    (): ObjectType<UserEntity> => UserEntity,
    (doctor: UserEntity): AppointmentEntity[] => doctor.doctorAppointments,
  )
  @JoinColumn({ name: 'doctorId', referencedColumnName: 'id' })
  public Doctor: UserEntity;
}
