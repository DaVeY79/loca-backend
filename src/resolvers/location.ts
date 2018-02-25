import { JsonWebTokenError } from 'jsonwebtoken';
import { QueryFailedError } from 'typeorm';

import { LocaGQL } from '../schema/types';

import { Location, LocationAccess, User } from '../entities/';
import { JWT, Location as LocationService } from '../services/';

import { IGraphQLContext } from '../router/graphql';

export default {
  Location: {
    latitude: (location: Location) => location.point[0],
    longitude: (location: Location) => location.point[1],
  },
  Query: {
    async location(root, { virtualAddress, token }: { virtualAddress: string, token?: string }) {
      if (!virtualAddress.includes('@')) {
        return null;
      }

      const [username, code] = virtualAddress.split('@');
      const user = await User.findOne({ username });

      if (!user) {
        return null;
      }

      if (token) {
        try {
          const payload: any = JWT.verify(token);
          if (payload && payload.type === 'TEMPORARY_LOCATION_ACCESS' && payload.virtualAddress === virtualAddress) {
            return await Location.findOne({ user, code, access: LocationAccess.PRIVATE });
          }
          throw new Error('Unauthorized access token');
        } catch (error) {
          if (error instanceof JsonWebTokenError) {
            throw new Error('Invalid access token');
          }
          throw error;
        }
      }

      return await Location.findOne({ user, code, access: LocationAccess.PUBLIC });
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
      { input }: { input: LocaGQL.ILocationIDInput },
      context: IGraphQLContext,
    ): Promise<{ location: Location }> {
      const location = await Location.findOne({ id: input.id, user: context.user });
      if (!location) {
        throw new Error('Not found');
      }
      await location.remove();
      location.id = input.id;
      return { location };
    },
    async shareLocationLink(
      root,
      { input }: { input: LocaGQL.IShareLocationLinkInput },
      context: IGraphQLContext,
    ): Promise<{ location: Location, link: string }> {
      const location = await Location.findOne({ id: input.id, user: context.user });
      if (!location) {
        throw new Error('Not found');
      }
      return {
        location,
        link: LocationService.getShareableLink({ location, expirySeconds: input.expirySeconds }),
      };
    },
  },
};
