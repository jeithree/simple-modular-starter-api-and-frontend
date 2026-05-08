import {Router} from 'express';
import authRoutes from '../modules/auth/index.ts';
import userRoutes from '../modules/user/index.ts';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
