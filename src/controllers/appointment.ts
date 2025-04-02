import { AppointmentEntity } from "@core/entities/appointment";
import { TYPES } from "@core/types";
import { auth } from "@middlewares/auth";
import { IAppointmentService } from "@services/interfaces/appointment";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  interfaces,
  queryParam,
  requestBody,
  requestParam,
} from "inversify-express-utils";

@controller("/appointment")
export class AppointmentController
  extends BaseHttpController
  implements interfaces.Controller
{
  constructor(
    @inject(TYPES.AppointmentService)
    private readonly appointmentService: IAppointmentService
  ) {
    super();
  }

  @httpGet("/patient/:id", auth)
  async listByPatientId(
    @requestParam("id") patientId: string
  ): Promise<AppointmentEntity[]> {
    return this.appointmentService.listByPatientId(patientId);
  }

  @httpGet("/doctor/:id", auth)
  async listByDoctorId(
    @requestParam("id") doctorId: string
  ): Promise<AppointmentEntity[]> {
    return this.appointmentService.listByDoctorId(doctorId);
  }

  @httpPost("/", auth)
  async save(
    @requestBody() body: AppointmentEntity
  ): Promise<AppointmentEntity> {
    return this.appointmentService.save(body);
  }

  @httpGet("/date", auth)
  async listByDate(@queryParam("date") date: string) {
    return this.appointmentService.listByDate(date);
  }
}
