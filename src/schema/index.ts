import Query from './query';
import Mutation from './mutation';
import User from './user';

const SchemaDefinition = `
  schema {
    query: Query
    mutation: Mutation
  }
`;

export default [
  SchemaDefinition,
  Query,
  Mutation,
  User,
];
