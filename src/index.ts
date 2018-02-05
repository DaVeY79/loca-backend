import 'reflect-metadata';

import * as express from 'express';
import router from './router';

import { PORT } from './config';

const app = express();

app.set('view engine', 'ejs');

app.use(router);

// tslint:disable-next-line:no-console
app.listen(PORT, () => console.log(`loca-backend is now running on port ${PORT}`));
