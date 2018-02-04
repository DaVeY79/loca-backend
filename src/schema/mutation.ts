export default `
  type Mutation {
    accountKitSignup(code: String!, state: String!): User
  }
`;
