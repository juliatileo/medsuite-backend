import { Column, Entity, JoinColumn, ObjectType, OneToMany } from "typeorm";

import Base from "@entities/dto/base";
import { AppointmentEntity } from "./appointment";

export enum UserType {
  PATIENT = 1,
  DOCTOR = 2,
}

@Entity("users")
export class UserEntity extends Base {
  @Column({ nullable: false })
  public name: string;

  @Column({ unique: true, nullable: false })
  public cellphone: string;

  @Column({ unique: true, nullable: false })
  public email: string;

  @Column({ nullable: false })
  public password: string;

  @Column({
    type: "enum",
    enum: UserType,
    nullable: false,
    default: UserType.PATIENT,
  })
  public type: UserType;

  @OneToMany(
    (): ObjectType<AppointmentEntity> => AppointmentEntity,
    (appointment: AppointmentEntity): UserEntity => appointment.Patient
  )
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  public patientAppointments: AppointmentEntity[];

  @OneToMany(
    (): ObjectType<AppointmentEntity> => AppointmentEntity,
    (appointment: AppointmentEntity): UserEntity => appointment.Patient
  )
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  public doctorAppointments: AppointmentEntity[];
}
