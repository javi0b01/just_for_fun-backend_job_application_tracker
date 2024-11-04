import { Router } from 'express';
import timeLog from '../middlewares/timeLog';
import SignUpController from '../controllers/signUpController';

const router: Router = Router();

router.use(timeLog);

router.post('/', SignUpController.register);
router.patch('/:id', SignUpController.changePassword);
router.delete('/:id', SignUpController.delete);

export default router;
