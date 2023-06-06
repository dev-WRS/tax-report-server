import { DocumentDefinition } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { I_UserDocument, UserModel } from '../models/authentication/user.model';
import { SECRET_KEY } from '../middleware/auth.middleware';

const db = 'mongodb://localhost:27017/wrs_tax_report';
const mongoose = require('mongoose');
mongoose.connect(db, (err: string) => {
    if (err) {
        console.error('Error!' + err)
    } else {
        console.log('Connected to mongodb')
    }
});

export async function register(user: DocumentDefinition<I_UserDocument>): Promise<void> {
    try { 
        await UserModel.create(user);
    } catch (err) {
        throw err;
    }
}

export async function login(user: DocumentDefinition<I_UserDocument>) {
    try {
        const foundUser = await UserModel.findOne({ email: user.email });

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
