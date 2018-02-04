import Query from './query';
import Mutation from './mutation';

const SchemaDefinition = `
  schema {
    query: Query
    mutation: Mutation
  }
`;

export default [SchemaDefinition, Query, Mutation];
