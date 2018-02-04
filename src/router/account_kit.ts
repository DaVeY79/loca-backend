import express from 'express';
import { CSRF, FACEBOOK_APP_ID, ACCOUNT_KIT_API_VERSION } from '../config';

const router = express.Router();

router.get('/account_kit', (req, res) => {
  res.render('account_kit', {
    CSRF,
    FACEBOOK_APP_ID,
    ACCOUNT_KIT_API_VERSION,
  });
});

export default router;
