import bcrypt from 'bcrypt';
import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
export const jwtAuthentication = async(password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const result = await bcrypt.hash(password, salt);
    return result;
}

export const decrypt = (key: string, value: string) => {
    const textParts = value.split('.');
	const iv = Buffer.from(textParts.shift(), 'hex');
	const encryptedText = Buffer.from(textParts.join('.'), 'hex');
	const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);

	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted.toString();
}