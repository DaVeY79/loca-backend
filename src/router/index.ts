import express from 'express';
import graphql from './graphql';
import accountKit from './account_kit';

const router = express.Router();

router.use(accountKit);
router.use(graphql);

export default router;
