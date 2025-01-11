import { Column, Entity } from "typeorm";

import Base from "@entities/dto/base";

export enum UserType {
  PATIENT = 1,
  DOCTOR = 2,
}

@Entity("users")
export default class UserEntity extends Base {
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
}
