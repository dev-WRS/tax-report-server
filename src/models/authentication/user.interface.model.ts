export interface IUserChangePassword {
    email: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}