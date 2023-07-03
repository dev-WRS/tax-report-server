import { LeanDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { I_UserDocument, UserStatus, createUser, getUserByEmail, getUserByResetToken } from '@models/authentication/user.model';
import { UserLoggedIn, UserLogin, UserResetPassword, UserToRegister, validateUserLogin,
        validateUserResetPassword, validateUserToRegister } from '@interfaces/user.interface';
import { jwtAuthentication } from 'helper/decrypt-authentication';
import { transporter } from '@config/mailer';
import config from '@config/config';

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
        });

        const token = jwt.sign({ email: newUser.email, role: newUser.role}, config.secrets.jwtSecret, { expiresIn: '1h'} );
        const verificationLink = `http://${config.server.hostname}:${config.server.frontEndPort}/confirm-registry/${token}`;

        await transporter.sendMail({
            from: config.smtp.sender,
            to: user.email,
            subject: 'Welcome to Walker Reid Strategies Tax Report',
            html: `<p>Welcome to Walker Reid Strategies Tax Report</p>
                   <p>In Order to confirm your account in Walker Reid Strategies Tax Report</p>
                   <p>Please follow the next link and confirm:</p>
                   <a href="${verificationLink}">${verificationLink}</a>`
        });

        return newUser;
    } catch (err) {
        if (err.code === 11000) {
            throw new Error('Already exist user with this username');
        } else {
            throw new Error(err);
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

        if (foundUser.status !== UserStatus.VERIFIED) {
            throw new Error('Your account is not verified yet');
        }

        const passwordEquals = await bcrypt.compare(user.password, foundUser.authentication.password);

        if (!passwordEquals) {
            throw new Error('Password is not correct');
        }

        const token = jwt.sign({ email: foundUser.email, role: foundUser.role}, config.secrets.jwtSecret, { expiresIn: '2h'} );
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
        throw new Error(err);
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

        if (foundUser.status !== UserStatus.VERIFIED) {
            throw new Error('Your account is not verified yet');
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
        throw new Error(err);
    }
}

export async function forgotPassword(email: string): Promise<boolean> {
    if (!email) {
        throw new Error('Email is required');
    }

    const message = 'Check your mail for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.';
    let verificationLink;
    let emailStatus = 'OK';

    let foundUser = await getUserByEmail(email);

    if (!foundUser) {
        throw new Error('User not exist width this email');
    }

    if (foundUser.status !== UserStatus.VERIFIED) {
        throw new Error('Your account is not verified yet');
    }

    try {         
        const token = jwt.sign({ email: foundUser.email, role: foundUser.role}, config.secrets.jwtSecret, { expiresIn: '10m'} );
        verificationLink = `http://${config.server.hostname}:${config.server.frontEndPort}/new-password/${token}`;
        foundUser.authentication.resetToken = token;      
    } catch (err) {
        throw new Error(message);
    }

    try {
        await transporter.sendMail({
            from: config.smtp.sender,
            to: foundUser.email,
            subject: 'Forgot Password',
            html: `<b>Please click on the following link or paste this into your browser to reset your password:</b>
                    <a href="${verificationLink}">${verificationLink}</a>`
        });
    } catch (err) {
        emailStatus = err;
        throw new Error('Something went wrong while sending email');
    }

    try {
        foundUser.updatedAt = new Date();
        await foundUser.save();
    }
    catch (err) {
        emailStatus = err;
        throw new Error('Something went wrong');
    }
    return true;
}

export async function newPassword(token: string, newPassword: string): Promise<boolean> {
    if (!token) {
        throw new Error('Token is required');
    }
    if (!newPassword) {
        throw new Error('New Password is required');
    }

    try {
        const validToken = jwt.verify(token, config.secrets.jwtSecret);
        if (!validToken) {
          throw new Error('Reset Token is not valid');
        }
    
        const foundUser = await getUserByResetToken(token);
        if (!foundUser) {
            throw new Error('User not exist width this token');
        }

        if (foundUser.status !== UserStatus.VERIFIED) {
            throw new Error('Your account is not verified yet');
        }

        if (foundUser.authentication.resetToken === '') {
            throw new Error('Your change password using this token. Please request new one');
        }

        foundUser.authentication.password = await jwtAuthentication(newPassword);
        foundUser.authentication.resetToken = '';
        foundUser.updatedAt = new Date();
        await foundUser.save();

    } catch (err) {
        throw new Error(err);
    }

    return true;
}

export async function confirmRegistry(token: string): Promise<boolean> {
    if (!token) {
        throw new Error('Token is required');
    }

    try {
        const validToken = await new Promise<JwtPayload>((resolve, reject) => {
            jwt.verify(token, config.secrets.jwtSecret, (err, decoded: JwtPayload) => {
                if (err) {
                    reject(new Error('Confirmation Token is not valid'));
                } else {
                    resolve(decoded);
                }
            });
        });
    
        const foundUser = await getUserByEmail(validToken.email);
        if (!foundUser) {
            throw new Error('User not exist width this token');
        }

        if (foundUser.status === UserStatus.VERIFIED) {
            throw new Error('Your account is verified already. Please login');
        }

        foundUser.status = UserStatus.VERIFIED;
        foundUser.updatedAt = new Date();
        await foundUser.save();

    } catch (err) {
        throw new Error(err);
    }
    
    return true;
}

