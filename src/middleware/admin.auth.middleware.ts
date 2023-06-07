import { Request, Response, NextFunction } from "express";
import { get } from "lodash";

export const adminAuthorize = (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies['WRS-AUTH'];
        if (!sessionToken) {
          return res.status(403).send('Please authenticate');
        }

        const currentUserRole = get(req, 'identity.role');
        if (currentUserRole !== 'admin') {
            return res.status(403).send('Insufficient permissions');
        }

        next();   
    } catch (err) {
        return res.status(401).send('Insufficient permissions');
    }
};