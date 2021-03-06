import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const createSession = new CreateSessionService();
  const { user, token } = await createSession.execute({ email, password });

  return response.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
    token,
  });
});

export default sessionsRouter;
