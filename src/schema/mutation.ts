export default `
  type Mutation {
    ping: String
    accountKitSignup(code: String!, state: String!): User
  }
`;
