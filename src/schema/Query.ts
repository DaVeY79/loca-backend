export default `
  type Query {
    me: User
    location(virtualAddress: String!): Location
    health: String!
  }
`;
