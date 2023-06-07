import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import logging from '../../utils/logging';
import { getErrorMessage } from '../../utils/error.utils';
import AuthService from '../../services/auth.service';

class AuthController {
    private authService: AuthService;
    public NAMESPACE: string = 'Auth Controller';

    constructor() {
        this.authService = new AuthService();
      }

    public async login (req: Request, res: Response) {
        try {
            const foundUser = await this.authService.login(req.body);
            res.status(200).send({user: {email: foundUser.user.email, name: foundUser.user.name, role: foundUser.user.role, token: foundUser.token }}); 
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            logging.error(this.NAMESPACE, `Error occurred while logging in user: ${errorMessage}`);
            return res.status(500).send({ message: errorMessage });
        }
    };
    
    public async register(req: Request, res: Response) {
        try {
            const  errors = validationResult(req.body);
    
            if (!errors.isEmpty()) {
                return res.status(500).send({ message: 'Validation Errors' });
            }
            
            const createdUser = await this.authService.register(req.body);
            res.status(200).send({ user: createdUser });
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            logging.error(this.NAMESPACE, `Error occurred while registering user: ${errorMessage}`);
            return res.status(500).send({ message: errorMessage });
        }
    };
    
    public async changePassword(req: Request, res: Response) {
        try {
            const result = await this.authService.changePassword(req.body);
            res.status(200).send(result); 
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            logging.error(this.NAMESPACE, `Error occurred while changing password in user: ${errorMessage}`);
            return res.status(500).send({ message: errorMessage });
        }
    }
}


export default AuthController;