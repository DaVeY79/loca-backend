import { QueryFailedError } from 'typeorm';

import { LocaGQL } from '../schema/types';

import { Location, LocationAccess, User } from '../entities/';
import { IGraphQLContext } from '../router/graphql';

export default {
  Location: {
    latitude: (location: Location) => location.point[0],
    longitude: (location: Location) => location.point[1],
  },
  Query: {
    async location(root, { virtualAddress }: { virtualAddress: string }) {
      if (!virtualAddress.includes('@')) {
        return null;
      }

      const [username, code] = virtualAddress.split('@');
      const user = await User.findOne({ username });

      if (!user) {
        return null;
      }

      const location = await Location.findOne({ user, code, access: LocationAccess.PUBLIC });

      if (!location) {
        return null;
      }

      return location;
    },
  },
  Mutation: {
    async createLocation(
      root,
      { input }: { input: LocaGQL.ICreateLocationInput },
      context: IGraphQLContext,
    ): Promise<{ location: Location }> {
      const location = new Location();
      location.access = LocationAccess[input.access];
      location.code = input.code;
      location.description = input.description || input.code;
      location.point = [input.latitude, input.longitude];
      location.user = context.user;

      return { location: await location.validateAndSave() };
    },
    async deleteLocation(
      root,
      { input }: { input: LocaGQL.IDeleteLocationInput },
      context: IGraphQLContext,
    ): Promise<{ location: Location }> {
      const location = await Location.findOne({ id: input.id, user: context.user });
      if (!location) {
        throw new Error('Not found');
      }
      return { location: await location.remove() };
    },
  },
};
