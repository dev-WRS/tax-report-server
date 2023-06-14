import { Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken';

import config from '../config/config';

export const checkRoleAuthorize = (req: Request, res: Response, next: NextFunction) => {
    try {
        const headerToken = req.headers['authorization'];

        if (!headerToken) {
          return res.status(403).send('Please authenticate');
        }
        
        let jwtPayload = <any>jwt.verify(headerToken.slice(7), config.secrets.jwtSecret);
        res.locals.jwtPayload = jwtPayload;

         if (jwtPayload && jwtPayload.role !== 'admin') {
            return res.status(403).send('Insufficient permissions');
        }

        next();   
    } catch (err) {
        return res.status(401).send('Insufficient permissions');
    }
};
