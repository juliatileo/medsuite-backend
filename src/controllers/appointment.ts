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
import { IAppointmentSearchParameters, Pagination } from '@core/types/pagination';

import { IAppointmentService } from '@services/interfaces/appointment';

import { auth } from '@middlewares/auth';

import { controllerPaginationHelper } from '../helpers';

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
  async getPaginated(
    @request() req: Request,
    @queryParam() queryParams: IAppointmentSearchParameters,
  ): Promise<Pagination<AppointmentEntity>> {
    const { doctorName, patientName, doctorId, patientId } = queryParams;

    const searchParameter: IAppointmentSearchParameters = {
      ...controllerPaginationHelper(req.query),
      doctorName,
      patientName,
      doctorId,
      patientId,
    };

    return this.appointmentService.getPaginated(searchParameter);
  }

  @httpPost('/', auth)
  async save(@requestBody() body: AppointmentEntity): Promise<AppointmentEntity> {
    return this.appointmentService.save(body);
  }

  @httpGet('/date', auth)
  async listByDate(@queryParam('date') date: string): Promise<AppointmentEntity[]> {
    return this.appointmentService.listByDate(date);
  }
}
