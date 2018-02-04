import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import typeDefs from './schema';
import resolvers from './resolvers';

import { PORT } from './config';

const app = express();

const schema = makeExecutableSchema({ typeDefs, resolvers });

addMockFunctionsToSchema({ schema, preserveResolvers: true });

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// eslint-disable-next-line no-console
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
