import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRepository: AppointmentsRepository = new AppointmentsRepository();
const appointmentsRouter = Router();

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentsRepository.all();
  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;
    const createService = new CreateAppointmentService(appointmentsRepository);
    const parsedDate = parseISO(date);
    const appointment = createService.execute({ provider, date: parsedDate });

    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({
      message: error.message,
    });
  }
});

export default appointmentsRouter;
