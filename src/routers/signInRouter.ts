import { Router } from 'express';
import SignInController from '../controllers/signInController';

const router: Router = Router();

router.post('/', SignInController.login);

export default router;
