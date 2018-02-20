export default `
  type Mutation {
    accountKitSignup(input: AccountKitSignupInput!): AccountKitSignupPayload!
    updateUser(input: UpdateUserInput!): UserPayload!
    createLocation(input: CreateLocationInput!): LocationPayload!
    updateLocation(input: UpdateLocationInput!): LocationPayload!
    deleteLocation(input: LocationIDInput!): LocationPayload!
    shareLocationLink(input: ShareLocationLinkInput!): ShareLocationLinkPayload!
  }

  input AccountKitSignupInput {
    code: String!
  }

  type AccountKitSignupPayload {
    apiToken: String!
    user: User!
  }

  input UpdateUserInput {
    name: String
    username: String!
    email: String
  }

  type UserPayload {
    user: User!
  }

  input LocationIDInput {
    id: ID!
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

  type LocationPayload {
    location: Location!
  }

  input ShareLocationLinkInput {
    id: ID!
    expirySeconds: Int
  }

  type ShareLocationLinkPayload {
    location: Location!
    link: String!
  }
`;
