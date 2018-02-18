export default `
  type Mutation {
    accountKitSignup(input: AccountKitSignupInput!): AccountKitSignupPayload!
    createLocation(input: CreateLocationInput!): LocationPayload!
    updateLocation(input: UpdateLocationInput!): LocationPayload!
    deleteLocation(input: DeleteLocationInput!): LocationPayload!
  }

  input AccountKitSignupInput {
    code: String!
  }

  type AccountKitSignupPayload {
    apiToken: String!
    user: User!
  }

  input CreateLocationInput {
    access: LocationAccess
    latitude: Float!
    longitude: Float!
    code: String!
    description: String
  }

  input UpdateLocationInput {
    id: ID!
    latitude: Float
    longitude: Float
    code: String
    description: String
  }

  input DeleteLocationInput {
    id: ID!
  }

  type LocationPayload {
    location: Location!
  }
`;
