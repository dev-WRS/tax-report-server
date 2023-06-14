import { LeanDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { I_UserDocument, createUser, getUserByEmail, getUserBySessionToken } from '../models/authentication/user.model';
import { UserLoggedIn, UserLogin, UserResetPassword, UserToRegister, validateUserLogin,
        validateUserResetPassword, validateUserToRegister } from '../interfaces/user.interface';
import { jwtAuthentication } from '../helper';

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

        const newUser = await createUser({
            email: user.email,
            fullName: user.fullName,
            userName: user.userName,
            authentication: {
                password: await jwtAuthentication(user.password),
            },
            role: user.role,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return newUser;
    } catch (err) {
        if (err.code === 11000) {
            throw new Error('Already exist user with this username');
        } else {
            throw err;
        }
    }
}

export async function login(user: UserLogin): Promise<UserLoggedIn> {
    try {
        if (!validateUserLogin) {
            throw new Error('Validation error');
        }

        const foundUser = await getUserByEmail(user.email)
                                .select('+authentication.password');

        if (!foundUser) {
            throw new Error('User not exist width this email');
        }

        const passwordEquals = await bcrypt.compare(user.password, foundUser.authentication.password);

        if (!passwordEquals) {
            throw new Error('Password is not correct');
        }

        const token = jwt.sign({ email: foundUser.email, role: foundUser.role}, process.env.JWT_SECRET, { expiresIn: '2h'} );
        foundUser.authentication.sessionToken = token;
        foundUser.updatedAt = new Date();

        await foundUser.save();
        return {
            email: foundUser.email, 
            userName: foundUser.userName,
            fullName: foundUser.fullName, 
            role: foundUser.role, 
            token: token,        
        };        
    } catch (err) {
        throw err;
    }
}

export async function logout(sessionToken: string): Promise<boolean> {
    try {
        const token = sessionToken.slice(7);
        const foundUser = await getUserBySessionToken(token);

        if (!foundUser) {
            throw new Error('User is not logged in');
        }

        foundUser.authentication.sessionToken = '';
        foundUser.updatedAt = new Date();
        await foundUser.save();

        return true;
    } catch (err) {
        throw err;
    }
}

export async function resetPassword(user: UserResetPassword): Promise<boolean> {
    try {
        if (!validateUserResetPassword) {
            throw new Error('Validation error');
        }

        const foundUser = await getUserByEmail(user.email).select('+authentication.password');

        if (!foundUser) {
            throw new Error('User not exist width this email');
        }

        const passwordEquals = await bcrypt.compare(user.password, foundUser.authentication.password);

        if (!passwordEquals) {
            throw new Error('Password is not correct');
        }

        if (user.newPassword !== user.confirmPassword) {
            throw new Error('New Password do not match');
        }

        foundUser.authentication.password = await jwtAuthentication(user.newPassword);
        foundUser.updatedAt = new Date();
        await foundUser.save();

        return true;
    } catch (err) {
        throw err;
    }
}

export async function forgotPassword(email: string): Promise<boolean> {
    if (!email) {
        throw new Error('Email is required');
    }

    const message = 'Check your mail for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.';
    let verificationLink;
    let emailStatus = 'OK';

    let user = await getUserByEmail(email);
    try {         
        const token = jwt.sign({ email: user.email, role: user.role}, process.env.JWT_SECRET, { expiresIn: '10m'} );
        verificationLink = `http://${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}/new-password/${token}`;
        user.authentication.resetToken = token;      
    } catch (err) {
        throw new Error(message);
    }

    try {

    } catch (err) {
        emailStatus = err;
        throw new Error('Something went wrong while sending email');
    }

    try {
        user.updatedAt = new Date();
        await user.save();
    }
    catch (err) {
        emailStatus = err;
        throw new Error('Something went wrong');
    }
    return true;
}

