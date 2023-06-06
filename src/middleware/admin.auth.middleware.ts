import { Request, Response, NextFunction } from "express";

const adminAuthorize = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.user.role !== 'admin') {
            return res.status(401).send('You do not have permission');
        }
        next();   
    } catch (err) {
        return res.status(401).send('You do not have permission');
    }
};

export default adminAuthorize;