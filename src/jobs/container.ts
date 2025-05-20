import { Container } from 'inversify';

import { coreContainerBind } from '@core/container';
import { TYPES } from '@core/types';

import { AppointmentsManager } from './src/managers/appointments';
import { IAppointmentsManager } from './src/managers/interfaces/appointments';

export const container = new Container();

coreContainerBind(container);

container.bind<IAppointmentsManager>(TYPES.AppointmentsManager).to(AppointmentsManager);
