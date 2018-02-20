export default `
  type Query {
    me: User
    location(virtualAddress: String!, token: String): Location
    health: String!
  }
`;
