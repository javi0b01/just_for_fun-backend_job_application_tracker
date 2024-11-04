import { Router } from 'express';
import UsersController from '../controllers/usersController';

const router: Router = Router();

router.post('/', UsersController.create);
router.get('/', UsersController.readAll);
router.get('/:id', UsersController.read);
router.put('/:id', UsersController.update);
/*
router.patch('/users/:id', UsersController.updateChunk);
router.delete('/users/:id', UsersController.delete);
*/

export default router;
