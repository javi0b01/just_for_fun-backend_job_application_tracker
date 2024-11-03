import { Router } from 'express';
import UsersController from '../controllers/usersController';

const router: Router = Router();

router.post('/users', UsersController.create);
router.get('/users', UsersController.readAll);
router.get('/users/:id', UsersController.read);
router.put('/users/:id', UsersController.update);
/*
router.patch('/users/:id', UsersController.updateChunk);
router.delete('/users/:id', UsersController.delete);
*/

export default router;
