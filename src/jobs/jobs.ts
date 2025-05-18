import cron from 'node-cron';

import { TYPES } from '@core/types';

import { container } from './container';
import { IAppointmentsManager } from './src/managers/interfaces/appointments';

const AppointmentsManager = container.get<IAppointmentsManager>(TYPES.AppointmentsManager);

cron.schedule('* * * * *', () => {
  AppointmentsManager.updateAppointmentStatus();
});
