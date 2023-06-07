import { DocumentDefinition } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { I_UserDocument, UserModel } from '../models/authentication/user.model';
import { SECRET_KEY } from '../middleware/auth.middleware';
import { IUserChangePassword, IUserLogin } from '../models/authentication/user.interface.model';
import UserRepository from '../repositories/user.repository';

class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async register(user: DocumentDefinition<I_UserDocument>): Promise<void> {
        try { 
            await this.userRepository.createUser(user);
        } catch (err) {
            throw err;
        }
    }
    
    public async login(user: IUserLogin) {
        try {
            const foundUser = await this.userRepository.findByEmailWithPassword(user.email);
    
            if (!foundUser) {
                throw new Error('User not exist width this email');
            }
    
            const isMatch = bcrypt.compareSync(user.password, foundUser.password);
    
            if (isMatch) {
                const token = jwt.sign({ _id: foundUser._id?.toString(), name: foundUser.name }, SECRET_KEY, {
                    expiresIn: '2 hours',
                  });
             
                  return { user: foundUser, token: token };
            } else {
                throw new Error('Password is not correct');
            }
        } catch (err) {
            throw err;
        }
    }
    
    public async changePassword(user: IUserChangePassword) {
        try {
            if (user.newPassword !== user.confirmPassword) {
                throw new Error('Password not match');
            }
    
            const foundUser = await this.userRepository.findByEmailWithPassword(user.email);
    
            if (!foundUser) {
                throw new Error('User not exist width this email');
            }
            //TODO validate new and confirm password
    
            const isMatch = bcrypt.compareSync(user.password, foundUser.password);
            if (!isMatch) {
                throw new Error('Password do not match');
            }
    
            if (user.password === user.newPassword) {
                throw new Error('Password do not change');
            }
    
            const updatedUser = await this.userRepository.updatePassword(foundUser._id, user.newPassword);
    
            if (!updatedUser){
                throw new Error('Password do not change');
            }
    
            return true;
    
        } catch (err) {
            throw err;
        }
    }
}

export default AuthService;