import { JsonWebTokenError } from 'jsonwebtoken';
import { QueryFailedError } from 'typeorm';

import { LocaGQL } from '../schema/types';

import { Location, LocationAccess, LocationAuthorization, LocationAuthorizationStatus, User } from '../entities/';
import { JWT, Location as LocationService } from '../services/';

import { IGraphQLContext } from '../router/graphql';

export default {
  Location: {
    latitude: (location: Location) => location.point[0],
    longitude: (location: Location) => location.point[1],
    virtualAddress: (location: Location) => LocationService.getVirtualAddress(location),
  },
  LocationAuthorization: {
    location(locationAuthorization: LocationAuthorization, args, context: IGraphQLContext) {
      const isPublic = locationAuthorization.location.access === LocationAccess.PUBLIC;
      const isOwner = locationAuthorization.owner.id === context.user.id;
      const isViewer = locationAuthorization.viewer.id === context.user.id;
      const isApproved = locationAuthorization.status === LocationAuthorizationStatus.APPROVED;
      return (isPublic || isOwner || (isViewer && isApproved)) ? locationAuthorization.location : null;
    },
    virtualAddress: (locationAuthorization: LocationAuthorization) =>
      LocationService.getVirtualAddress(locationAuthorization.location),
  },
  Query: {
    async location(root, { virtualAddress, token }: { virtualAddress: string, token?: string }, context: IGraphQLContext) {
      const location = await LocationService.findByVirtualAddress(virtualAddress);

      if (!location) {
        throw new Error('Not found');
      }

      const isPublic = location.access === LocationAccess.PUBLIC;
      const isOwner = location.user.id === context.user.id;

      if (isPublic || isOwner) {
        return location;
      }

      if (token) {
        try {
          const payload: any = JWT.verify(token);
          if (payload && payload.type === 'TEMPORARY_LOCATION_ACCESS' && payload.virtualAddress === virtualAddress) {
            return await location;
          }
          throw new Error('Unauthorized access token');
        } catch (error) {
          if (error instanceof JsonWebTokenError) {
            throw new Error('Invalid access token');
          }
          throw error;
        }
      }

      const hasLocationAccess = Boolean(await LocationAuthorization.findOne({
        location,
        status: LocationAuthorizationStatus.APPROVED,
        viewer: context.user,
      }));

      if (hasLocationAccess) {
        return location;
      }

      throw new Error('Token or access needed');
    },
    async locationsGrantedToMe(root, args, context: IGraphQLContext): Promise<Location[]> {
      const authorizations = await LocationAuthorization.find({ where: {
        viewer: context.user,
        status: LocationAuthorizationStatus.APPROVED,
      } });
      return authorizations.map(authorization => authorization.location);
    },
    locationsRequestedFromMe(root, args, context: IGraphQLContext): Promise<LocationAuthorization[]>  {
      return LocationAuthorization.find({ where: { owner: context.user } });
    },
    locationsRequestedByMe(roots, args, context: IGraphQLContext): Promise<LocationAuthorization[]>  {
      return LocationAuthorization.find({ where: { viewer: context.user } });
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
    async requestLocationAccess(
      root,
      { input }: { input: LocaGQL.ILocationVAInput },
      context: IGraphQLContext,
    ): Promise<{ locationAuthorization: LocationAuthorization }> {
      const location = await LocationService.findByVirtualAddress(input.virtualAddress);
      if (!location) {
        throw new Error('Not found');
      }

      const authorization = new LocationAuthorization();
      authorization.owner = location.user;
      authorization.viewer = context.user;
      authorization.location = location;
      authorization.status =
        (location.access === LocationAccess.PUBLIC)
        ? LocationAuthorizationStatus.APPROVED
        : LocationAuthorizationStatus.REQUESTED;

      try {
        return { locationAuthorization: await authorization.save() };
      } catch (error) {
        if (error instanceof QueryFailedError && (error as any).constraint === 'unique_index_location_authorizations_on_location_and_viewer') {
          throw new Error('You have already requested access to that location');
        }
        throw error;
      }
    },
    async grantLocationAccess(
      root,
      { input }: { input: LocaGQL.ILocationAuthorizationIDInput },
      context: IGraphQLContext,
    ): Promise<{ locationAuthorization: LocationAuthorization }> {
      const authorization = await LocationAuthorization.findOne({ id: input.id, owner: context.user });
      if (!authorization) {
        throw new Error('Not found');
      }

      authorization.status = LocationAuthorizationStatus.APPROVED;

      return { locationAuthorization: await authorization.save() };
    },
    async deleteLocationAccess(
      root,
      { input }: { input: LocaGQL.ILocationAuthorizationIDInput },
      context: IGraphQLContext,
    ): Promise<{ locationAuthorization: LocationAuthorization }> {
      const authorization = await LocationAuthorization.findOne({ id: input.id });

      if (authorization && (authorization.owner.id === context.user.id || authorization.viewer.id === context.user.id)) {
        await authorization.remove();

        authorization.id = input.id;
      } else {
        throw new Error('Not found');
      }

      return { locationAuthorization: authorization };
    },
  },
};
