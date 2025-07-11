import { Container } from 'inversify';

import { AppointmentService } from '@services/appointment';
import { IAppointmentService } from '@services/interfaces/appointment';
import { IUserService } from '@services/interfaces/user';
import { UserService } from '@services/user';

import { IUserRepository } from '@repositories/interfaces/user-repository';
import { UserRepository } from '@repositories/user-repository';

import { AppointmentRepository } from './repositories/appointment-repository';
import { IAppointmentRepository } from './repositories/interfaces/appointment-repository';
import { IPatientInfoRepository } from './repositories/interfaces/patient-info-repository';
import { PatientInfoRepository } from './repositories/patient-info-repository';
import { IWhatsAppService } from './services/interfaces/whatsapp-interface';
import { WhatsAppService } from './services/whatsapp';
import { TYPES } from './types';

export const coreContainerBind = (container: Container): void => {
  container.bind<IUserService>(TYPES.UserService).to(UserService);
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
  container.bind<IAppointmentService>(TYPES.AppointmentService).to(AppointmentService);
  container.bind<IAppointmentRepository>(TYPES.AppointmentRepository).to(AppointmentRepository);
  container.bind<IPatientInfoRepository>(TYPES.PatientInfoRepository).to(PatientInfoRepository);
  container.bind<IWhatsAppService>(TYPES.WhatsAppService).to(WhatsAppService);
};

export const container = new Container();

coreContainerBind(container);
