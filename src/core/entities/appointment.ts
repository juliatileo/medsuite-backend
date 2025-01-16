import { Column, Entity, JoinColumn, ManyToOne, ObjectType } from "typeorm";
import Base from "./dto/base";
import { UserEntity } from "./user";

@Entity("appointments")
export class AppointmentEntity extends Base {
  @Column()
  date: Date;

  @Column()
  description: string;

  @Column()
  patientId: string;

  @Column()
  doctorId: string;

  @ManyToOne(
    (): ObjectType<UserEntity> => UserEntity,
    (patient: UserEntity): AppointmentEntity[] => patient.patientAppointments
  )
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  public Patient: UserEntity;

  @ManyToOne(
    (): ObjectType<UserEntity> => UserEntity,
    (doctor: UserEntity): AppointmentEntity[] => doctor.doctorAppointments
  )
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  public Doctor: UserEntity;
}
