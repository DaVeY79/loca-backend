export default `
  type Query {
    me: User
    location(virtualAddress: String!, token: String): Location
    locationsRequestedByMe: [LocationAuthorization!]!
    locationsRequestedFromMe: [LocationAuthorization!]!
    locationsGrantedToMe: [Location!]!
    health: String!
  }
`;
