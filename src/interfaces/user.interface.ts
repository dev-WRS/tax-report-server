export interface UserToRegister {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user' | undefined;
}

export interface UserRegistered {
    name: string;
    email: string;
    role: 'admin' | 'user' | undefined;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserLoggedIn{
    email: string;
    name: string;
    role: 'admin' | 'user' | undefined;
    token: string;
}

export function validateUserToRegister(user: UserToRegister): boolean {
    return user.name !== undefined && user.email !== undefined && user.password !== undefined;
}

export function validateUserLogin(user: UserLogin): boolean {
    return user.email !== undefined && user.password !== undefined;
}