import { Router } from 'express';

import * as cors from 'cors';

import accountKit from './accountKit';
import graphql from './graphql';

const router = Router();

router.use(accountKit);

router.use(cors());
router.use(graphql);

export default router;
