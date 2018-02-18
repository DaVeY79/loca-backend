import { QueryFailedError } from 'typeorm';

import { LocaGQL } from '../schema/types';

import { Location, LocationAccess } from '../entities/';
import { IGraphQLContext } from '../router/graphql';

export default {
  Location: {
    latitude: (location: Location) => location.point[0],
    longitude: (location: Location) => location.point[1],
  },
  Query: {
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
      try {
        return { location: await location.save() };
      } catch (error) {
        if (error instanceof QueryFailedError && (error as any).constraint === 'unique_index_location_on_user_id_and_code') {
          throw new Error('You have already used that code');
        }
        throw error;
      }
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
