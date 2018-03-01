import { resolve } from 'url';

import { FRONTEND_BASEURL } from '../config';

import { JWT } from './';

import * as entities from '../entities';

export class Location {
  public static getVirtualAddress = (location: entities.Location) =>
    `${location.user.username}@${location.code}`
  public static getShareableLink(
    { location, expirySeconds }: { location: entities.Location, expirySeconds?: number },
  ): string {
    const virtualAddress = Location.getVirtualAddress(location);
    if (location.access === entities.LocationAccess.PUBLIC) {
      return resolve(FRONTEND_BASEURL, `/#/vA/${virtualAddress}`);
    }
    const token = JWT.sign(
      { virtualAddress, type: 'TEMPORARY_LOCATION_ACCESS' },
      { expiresIn: expirySeconds ? `${expirySeconds} seconds` : Location.DEFAULT_LINK_VALIDITY },
    );
    return resolve(FRONTEND_BASEURL, `/#/vA/${virtualAddress}?token=${token}`);
  }
  public static async findByVirtualAddress(virtualAddress: string): Promise<entities.Location> {
    if (!virtualAddress.includes('@')) {
      return null;
    }

    const [username, code] = virtualAddress.split('@');
    const user = await entities.User.findOne({ username });

    if (!user) {
      return null;
    }

    return entities.Location.findOne({ user, code });
  }
  private static DEFAULT_LINK_VALIDITY = '1 hour';
}
