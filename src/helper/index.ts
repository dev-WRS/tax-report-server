import bcrypt from 'bcrypt';

export const jwtAuthentication = async(password: string) => {
    const result = await bcrypt.hash(password, 10);
    return result;
}