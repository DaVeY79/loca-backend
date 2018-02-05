export default `
  enum LocationAccess {
    PRIVATE
    PUBLIC
  }
  type Location {
    id: ID!
    user: User!
    access: LocationAccess!
    code: String!
    description: String!
    latitude: Float!
    longitude: Float!
  }
`;
