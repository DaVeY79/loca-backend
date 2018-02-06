// tslint:disable
// graphql typescript definitions

declare namespace LocaGQL {
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
    location: ILocation | null;
    health: string;
  }


  interface IUser {
    id: string;
    username: string;
    name: string | null;
    email: string | null;
    phoneNumber: string;
    locations: Array<ILocation>;
  }


  interface ILocation {
    id: string;
    user: IUser;
    access: ILocationAccessEnum;
    code: string;
    description: string;
    latitude: number;
    longitude: number;
  }


  type ILocationAccessEnum = 'PRIVATE' | 'PUBLIC';


  interface IMutation {
    accountKitSignup: IAccountKitSignupPayload;
    createLocation: ICreateLocationPayload;
  }


  interface IAccountKitSignupInput {
    code: string;
  }


  interface IAccountKitSignupPayload {
    apiToken: string;
    user: IUser;
  }


  interface ICreateLocationInput {
    access?: ILocationAccessEnum | null;
    latitude: number;
    longitude: number;
    code: string;
    description?: string | null;
  }


  interface ICreateLocationPayload {
    location: ILocation;
  }
}

// tslint:enable
export { LocaGQL };
