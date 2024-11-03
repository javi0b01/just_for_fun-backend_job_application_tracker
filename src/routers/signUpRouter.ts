import { Router } from 'express';
import timeLog from '../middlewares/timeLog';
import SignUpController from '../controllers/signUpController';

const router: Router = Router();

router.use(timeLog);

router.post('/sign-up', SignUpController.register);
router.patch('/sign-up/:id', SignUpController.changePassword);
router.delete('/sign-up/:id', SignUpController.delete);

export default router;
