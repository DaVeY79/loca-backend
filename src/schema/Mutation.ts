export default `
  type Mutation {
    accountKitSignup(input: AccountKitSignupInput): AccountKitSignupOutput!
  }

  input AccountKitSignupInput {
    code: String!
  }

  type AccountKitSignupOutput {
    apiToken: String!
    user: User!
  }
`;
