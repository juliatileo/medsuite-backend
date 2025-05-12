import { Request } from 'express';
import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  interfaces,
  queryParam,
  request,
  requestBody,
  requestParam,
} from 'inversify-express-utils';

import { AppointmentEntity } from '@core/entities/appointment';
import { TYPES } from '@core/types';
import { IAppointmentSearchParameters } from '@core/types/pagination';

import { IAppointmentService } from '@services/interfaces/appointment';

import { auth } from '@middlewares/auth';

@controller('/appointment')
export class AppointmentController extends BaseHttpController implements interfaces.Controller {
  constructor(
    @inject(TYPES.AppointmentService)
    private readonly appointmentService: IAppointmentService,
  ) {
    super();
  }

  @httpGet('/patient/:id', auth)
  async listByPatientId(@requestParam('id') patientId: string): Promise<AppointmentEntity[]> {
    return this.appointmentService.listByPatientId(patientId);
  }

  @httpGet('/doctor/:id', auth)
  async listByDoctorId(@requestParam('id') doctorId: string): Promise<AppointmentEntity[]> {
    return this.appointmentService.listByDoctorId(doctorId);
  }

  @httpGet('/get-paginated', auth)
  async getFiltered(
    @request() req: Request,
    @queryParam() queryParams: IAppointmentSearchParameters,
  ): Promise<AppointmentEntity[]> {
    const { doctorName, patientName, doctorId, patientId } = queryParams;

    const searchParameter: IAppointmentSearchParameters = {
      doctorName,
      patientName,
      doctorId,
      patientId,
    };

    return this.appointmentService.getFiltered(searchParameter);
  }

  @httpPost('/', auth)
  async save(@requestBody() body: AppointmentEntity): Promise<AppointmentEntity> {
    return this.appointmentService.save(body);
  }
}
