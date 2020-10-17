import { Router } from 'express';
import multer from 'multer';
import { getRepository } from 'typeorm';

import uploadConfig from '../config/upload';

import User from '../models/User';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
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
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateAvatarUser = new UpdateUserAvatarService();
    const user = await updateAvatarUser.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    return response.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  },
);

usersRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const usersRepository = getRepository(User);
  await usersRepository.delete(id);
  return response.send();
});

export default usersRouter;
