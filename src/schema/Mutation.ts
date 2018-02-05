export default `
  type Mutation {
    accountKitSignup(input: AccountKitSignupInput!): AccountKitSignupPayload!
    createLocation(input: CreateLocationInput!): CreateLocationPayload!
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

  type CreateLocationPayload {
    location: Location!
  }
`;
