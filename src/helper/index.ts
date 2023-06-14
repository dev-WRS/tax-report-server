import bcrypt from 'bcrypt';

export const jwtAuthentication = async(password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const result = await bcrypt.hash(password, salt);
    return result;
}