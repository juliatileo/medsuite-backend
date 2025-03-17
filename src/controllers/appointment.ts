import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, interfaces } from 'inversify-express-utils';

import { TYPES } from '@core/types';

import { IAppointmentService } from '@services/interfaces/appointment';

@controller('/appointment')
export class AppointmentController extends BaseHttpController implements interfaces.Controller {
  constructor(@inject(TYPES.AppointmentService) private readonly appointmentService: IAppointmentService) {
    super();
  }
    
    @httpGet('/')
}
