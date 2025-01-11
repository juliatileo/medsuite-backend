import { Container } from "inversify";

import { IUserService } from "@services/interfaces/user";

import { IUserRepository } from "@repositories/interfaces/user-repository";
import { UserRepository } from "@repositories/user-repository";

import { TYPES } from "./types";
import { UserService } from "@services/user";

export const container = new Container();

container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
