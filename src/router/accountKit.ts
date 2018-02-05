import { Router } from 'express';
import { ACCOUNT_KIT_API_VERSION, FACEBOOK_APP_ID } from '../config';

const router = Router();

router.get('/accountKit', (req, res) => {
  res.render('accountKit', {
    ACCOUNT_KIT_API_VERSION,
    FACEBOOK_APP_ID,
  });
});

export default router;
