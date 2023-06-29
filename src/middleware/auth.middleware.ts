import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import config from '@config/config';

export const jwtAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const headerToken = req.headers['authorization'];
   if (headerToken === undefined || !headerToken?.startsWith('Bearer ')) {
      return res.status(403).send('Please authenticate');
   }
 
   const bearerToken = headerToken.slice(7);
   const validToken = jwt.verify(bearerToken, config.secrets.jwtSecret);
   if (!validToken) {
     return res.status(403).send('Invalid token');
   }
 
   return next();
  } catch (err) {
    return res.status(401).send('Please authenticate');
  }
 };