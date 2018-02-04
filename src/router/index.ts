import { Router } from 'express';
import accountKit from './accountKit';
import graphql from './graphql';

const router = Router();

router.use(accountKit);
router.use(graphql);

export default router;
