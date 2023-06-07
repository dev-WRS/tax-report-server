import { Request, Response, NextFunction } from 'express';
import { merge } from 'lodash';

import { getUserBySessionToken } from '../models/authentication/user.model';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
 try {
  const sessionToken = req.cookies['WRS-AUTH'];
  if (!sessionToken) {
    return res.status(403).send('Please authenticate');
  }

  const existingUser = await getUserBySessionToken(sessionToken);
  if (!existingUser) {
    return res.status(403).send('Please authenticate');
  }

  merge(req, { identity: existingUser });

  return next();
 } catch (err) {
   return res.status(401).send('Please authenticate');
 }
};