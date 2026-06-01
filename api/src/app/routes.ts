import {Router} from 'express';
import authRoutes from '../modules/auth/index.ts';
import adminRoutes from '../modules/admin/index.ts';
import userRoutes from '../modules/user/index.ts';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);

export default router;
