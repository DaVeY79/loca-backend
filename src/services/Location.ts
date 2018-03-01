import { resolve } from 'url';
import { v4 as uuid } from 'uuid';

import { FRONTEND_BASEURL } from '../config';

import { JWT } from './';

import * as entities from '../entities';

export class Location {
  public static getVirtualAddress = (location: entities.Location) =>
    `${location.user.username}@${location.code}`
  public static async getShareableLink(
    { location, expirySeconds }: { location: entities.Location, expirySeconds?: number },
  ): Promise<{ accessibleLink: string, regularLink: string }> {
    const virtualAddress = Location.getVirtualAddress(location);
    const publicLink = resolve(FRONTEND_BASEURL, `/#/vA/${virtualAddress}`);
    if (location.access === entities.LocationAccess.PUBLIC) {
      return { accessibleLink: publicLink, regularLink: publicLink };
    }

    const token = new entities.EphemeralToken();
    token.location = location;
    token.expiry = new Date(Date.now() + (expirySeconds || (60 * 60)) * 1000);
    token.key = uuid();

    await token.save();

    return {
      accessibleLink: `publicLink?token=${token.key}`,
      regularLink: publicLink,
    };
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
