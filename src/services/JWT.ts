import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { JWT_ISSUER, JWT_SECRET } from '../config';
import { User } from '../entities';

export class JWT {
  public static sign = (payload: object, options: { expiresIn?: string, audience?: string, subject?: User }): string =>
    jwt.sign(
      { ...payload,
        iat: Math.floor(Date.now() / 1000) },
      JWT_SECRET,
      { subject: options.subject ? options.subject.id : '',
        jwtid: uuid(),
        expiresIn: options.expiresIn,
        notBefore: '0 ms',
        issuer: JWT_ISSUER,
        audience: JWT_ISSUER,
        algorithm: 'HS256' },
    )
  public static verify = (token): string | object =>
    jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_ISSUER,
    })
}
