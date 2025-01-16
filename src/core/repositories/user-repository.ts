import { injectable } from "inversify";
import { Repository } from "typeorm";

import { IUserRepository } from "@repositories/interfaces/user-repository";
import { UserEntity } from "@core/entities/user";
import dataSource from "@core/database";

@injectable()
export class UserRepository implements IUserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = dataSource.getRepository(UserEntity);
  }

  async list(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } });
  }
}
