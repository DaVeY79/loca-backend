// tslint:disable
// graphql typescript definitions

export declare namespace LocaGQL {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    message: string;            // Required for all errors
    locations?: Array<IGraphQLResponseErrorLocation>;
    [propName: string]: any;    // 7.2.2 says 'GraphQL servers may provide additional entries to error'
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }


  interface IQuery {
    me: IUser | null;
    health: string;
  }


  interface IUser {
    id: string;
    name: string | null;
    email: string | null;
    phoneNumber: string | null;
  }


  interface IMutation {
    accountKitSignup: IAccountKitSignupPayload;
  }


  interface IAccountKitSignupInput {
    code: string;
  }


  interface IAccountKitSignupPayload {
    apiToken: string;
    user: IUser;
  }
}

// tslint:enable
