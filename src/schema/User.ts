export default `
  type User {
    id: ID!
    username: String!
    name: String
    email: String
    phoneNumber: String!
    locations: [Location!]!
  }
`;
