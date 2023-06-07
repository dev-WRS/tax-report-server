class ConstantMessage {
    public static readonly API_WORKING: string = 'Api working';

    public static readonly TOKEN_NOT_VALID: string = 'Token not valid';
    public static readonly NOT_AUTHENTICATED: string = 'Not authenticated';
    public static readonly UNAUTHORIZED: string = 'Unauthorized';
    public static readonly NOT_ALLOWED: string = 'Not allowed';

    // auth
    public static readonly NAME_NOT_VALID: string = 'Name is not valid';
    public static readonly EMAIL_NOT_VALID: string = 'Email is not valid';
    public static readonly PASSWORD_NOT_VALID: string = 'Password is not valid';
    public static readonly EMAIL_EXIST: string = 'Email already exist';
    public static readonly USER_NOT_CREATE: string = 'User is not registered, please try again';
    public static readonly USER_CREATE_SUCCESS: string = 'User is registered successfully, please login';
    public static readonly USER_NOT_FOUND: string = 'User not found';
    public static readonly PASSWORD_NOT_MATCH: string = 'Password not match';
    public static readonly USER_LOGIN_SUCCESS: string = 'User is login success';
}

export default ConstantMessage;