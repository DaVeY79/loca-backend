export default `
  type Mutation {
    accountKitSignup(input: AccountKitSignupInput): AccountKitSignupPayload!
  }

  input AccountKitSignupInput {
    code: String!
  }

  type AccountKitSignupPayload {
    apiToken: String!
    user: User!
  }
`;
