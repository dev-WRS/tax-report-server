import crypto from 'crypto';

const SECRET = 'WRS-TAX-REPORT-API';

export const random = () => crypto.randomBytes(128).toString('base64');

export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/'))
                                     .update(SECRET).digest('hex');
};