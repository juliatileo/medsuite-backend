import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  httpPut,
  interfaces,
  requestBody,
} from 'inversify-express-utils';

import { UserEntity } from '@core/entities/user';
import { TYPES } from '@core/types';

import { IUserService } from '@services/interfaces/user';

import { auth } from '@middlewares/auth';

@controller('/user')
export class UserController extends BaseHttpController implements interfaces.Controller {
  constructor(@inject(TYPES.UserService) private readonly userService: IUserService) {
    super();
  }

  @httpGet('/', auth)
  async list(): Promise<UserEntity[]> {
    return this.userService.list();
  }

  @httpPost('/')
  async save(@requestBody() body: UserEntity): Promise<{ user: UserEntity; token: string }> {
    return this.userService.save(body);
  }

  @httpPut('/login')
  async login(
    @requestBody() { email, password }: { email: string; password: string },
  ): Promise<{ user: UserEntity; token: string }> {
    return this.userService.login({ email, password });
  }
}
