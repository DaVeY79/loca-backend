import { Router } from 'express';
import { ACCOUNT_KIT_API_VERSION, CSRF, FACEBOOK_APP_ID } from '../config';

const router = Router();

router.get('/account_kit', (req, res) => {
  res.render('account_kit', {
    ACCOUNT_KIT_API_VERSION,
    CSRF,
    FACEBOOK_APP_ID,
  });
});

export default router;
