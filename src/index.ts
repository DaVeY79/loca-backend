import 'reflect-metadata';

import * as express from 'express';
import router from './router';

import { PORT } from './config';

const app = express();

app.set('view engine', 'pug');

app.use(router);

// tslint:disable-next-line:no-console
app.listen(PORT, () => console.log('loca-backend is now running'));

// import {createConnection} from "typeorm";
// import {User} from "./entity/User";
//
// createConnection().then(async connection => {
//
//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);
//
//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);
//
//     console.log("Here you can setup and run express/koa/any other framework.");
//
// }).catch(error => console.log(error));
