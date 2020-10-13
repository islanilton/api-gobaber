import { Router } from 'express';
import { getRepository } from 'typeorm';

import User from '../models/User';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();
    const user = await createUser.execute({ name, email, password });
    const { id, created_at, updated_at } = user;
    return response.json({
      id,
      name,
      email,
      created_at,
      updated_at,
    });
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

usersRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const usersRepository = getRepository(User);
  await usersRepository.delete(id);
  return response.send();
});

export default usersRouter;
