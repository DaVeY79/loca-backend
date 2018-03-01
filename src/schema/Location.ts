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
    virtualAddress: String!
  }
  enum LocationAuthorizationStatus {
    REQUESTED
    APPROVED
  }
  type LocationAuthorization {
    id: ID!
    owner: User!
    viewer: User!
    location: Location
    status: LocationAuthorizationStatus!
  }
`;
