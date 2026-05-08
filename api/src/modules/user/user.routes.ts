import {Router} from 'express';
import {validateBody} from '../../middlewares/validation.ts';
import {isAuthenticated} from '../../middlewares/auth.ts';
import {updateProfileSchema} from './user.types.ts';
import * as userController from './user.controller.ts';

const router = Router();

router.get('/me', isAuthenticated, userController.getMe);
router.patch(
	'/me',
	isAuthenticated,
	validateBody(updateProfileSchema),
	userController.updateMe,
);

export default router;
