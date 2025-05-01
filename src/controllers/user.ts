import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  httpPut,
  interfaces,
  requestBody,
  requestParam,
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

  @httpGet('/patients', auth)
  async listPatients(): Promise<UserEntity[]> {
    return this.userService.listPatients();
  }

  @httpGet('/:id', auth)
  async getById(@requestParam('id') id: string): Promise<UserEntity> {
    return this.userService.getById(id);
  }

  @httpPost('/')
  async save(@requestBody() body: UserEntity): Promise<{ user: UserEntity; token: string }> {
    return this.userService.save(body);
  }

  @httpPut('/')
  async update(@requestBody() body: UserEntity): Promise<UserEntity> {
    return this.userService.update(body);
  }

  @httpPut('/login')
  async login(
    @requestBody() { email, password }: { email: string; password: string },
  ): Promise<{ user: UserEntity; token: string }> {
    return this.userService.login({ email, password });
  }

  @httpPut('/forgot-password')
  async forgotPassword(@requestBody() { email }: { email: string }): Promise<string> {
    return this.userService.forgotPassword(email);
  }

  @httpPut('/reset-password')
  async resetPassword(@requestBody() body: { resetToken: string; password: string }): Promise<void> {
    return this.userService.resetPassword(body);
  }
}
