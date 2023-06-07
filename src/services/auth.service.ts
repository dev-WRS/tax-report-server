import { LeanDocument } from 'mongoose';

import { I_UserDocument, createUser, getUserByEmail, getUserById, getUserBySessionToken } from '../models/authentication/user.model';
import { UserLoggedIn, UserLogin, UserToRegister, validateUserLogin,
        validateUserToRegister } from '../interfaces/user.interface';
import { authentication, random } from '../helper';

export async function register(user: UserToRegister): Promise<LeanDocument<I_UserDocument>> {
    try {
        const errors = validateUserToRegister(user);

        if (!errors) {
            throw new Error('Validation error');
        }

        const existingUser = await getUserByEmail(user.email);

        if (existingUser) {
            throw new Error('Already exist user with this email');
        }

        const salt = random();

        const newUser = await createUser({
            email: user.email,
            name: user.name,
            authentication: {
                salt: salt,
                password: authentication(salt, user.password),
            },
            role: user.role
        })

        return newUser;
    } catch (err) {
        throw err;
    }
}

export async function login(user: UserLogin): Promise<UserLoggedIn> {
    try {
        if (!validateUserLogin) {
            throw new Error('Validation error');
        }

        const foundUser = await getUserByEmail(user.email)
                                .select('+authentication.salt +authentication.password');

        if (!foundUser) {
            throw new Error('User not exist width this email');
        }

        const expectedHash = authentication(foundUser.authentication.salt, user.password);

        if (foundUser.authentication.password !== expectedHash) {
            throw new Error('Password is not correct');
        }

        const salt = random();
        foundUser.authentication.sessionToken = authentication(salt, foundUser._id.toString());

        await foundUser.save();
        return {
            email: foundUser.email, 
            name: foundUser.name, 
            role: foundUser.role, 
            token: foundUser.authentication.sessionToken,        
        };        
    } catch (err) {
        throw err;
    }
}

export async function logout(sessionToken: string): Promise<boolean> {
    try {
        const foundUser = await getUserBySessionToken(sessionToken);

        if (!foundUser) {
            throw new Error('User is not logged in');
        }

        foundUser.authentication.sessionToken = '';
        await foundUser.save();

        return true;
    } catch (err) {
        throw err;
    }
}

export async function isLoggedIn(sessionToken: string): Promise<boolean> {
    try {
        const foundUser = await getUserBySessionToken(sessionToken);

        if (!foundUser) {
            throw new Error('User is not logged in');
        }

        return true;
    } catch (err) {
        throw err;
    }
}
