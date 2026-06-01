import {Router} from 'express';
import {validateBody} from '../../middlewares/validation.ts';
import {isAuthenticated, isAdmin} from '../../middlewares/auth.ts';
import {updateUserSchema} from './admin.types.ts';
import * as adminController from './admin.controller.ts';

const router = Router();

router.get('/users', isAuthenticated, isAdmin, adminController.searchUsers);

router.patch(
	'/users/:id',
	isAuthenticated,
	isAdmin,
	validateBody(updateUserSchema),
	adminController.updateUser,
);
router.patch(
	'/users/:id/deactivate',
	isAuthenticated,
	isAdmin,
	adminController.deactivateUser,
);
router.patch(
	'/users/:id/reactivate',
	isAuthenticated,
	isAdmin,
	adminController.reactivateUser,
);

export default router;
