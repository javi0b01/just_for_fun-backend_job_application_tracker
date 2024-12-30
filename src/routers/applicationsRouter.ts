import { Router } from 'express';
import ApplicationsController from '../controllers/applicationsController';

const router: Router = Router();

router.post('/', ApplicationsController.register);
router.get('/', ApplicationsController.list);

export default router;
