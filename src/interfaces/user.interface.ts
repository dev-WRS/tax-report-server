import { Role } from "@models/authentication/user.model";

export interface UserToRegister {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    role: Role;
}

export interface UserRegistered {
    fullName: string;
    userName: string;
    email: string;
    role: Role;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserResetPassword {
    email: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
}

export interface UserLoggedIn{
    email: string;
    fullName: string;
    userName: string;
    role: Role;
    token: string;
}

export interface UserToUpdate {
    fullName: string;
    userName: string;
    role: Role;
}

export function validateUserToRegister(user: UserToRegister): boolean {
    return user.userName !== undefined && user.fullName !== undefined && user.email !== undefined && user.password !== undefined;
}

export function validateUserLogin(user: UserLogin): boolean {
    return user.email !== undefined && user.password !== undefined;
}

export function validateUserResetPassword(user: UserResetPassword): boolean {
    return user.email !== undefined && user.newPassword !== undefined  && user.password !== undefined && user.confirmPassword !== undefined;
}