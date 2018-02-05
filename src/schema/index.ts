import Mutation from './Mutation';
import Query from './Query';

import Location from './Location';
import User from './User';

const schemaDefinition = `
  schema {
    query: Query
    mutation: Mutation
  }
`;

export default [
  schemaDefinition,
  Query,
  Mutation,
  User,
  Location,
];
