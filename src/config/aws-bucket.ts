import { decrypt } from '../helper';
import config from '../config/config';


export function getValuesFromEncryptedConfig() {
    const decrypted = decrypt(config.secrets.phrase, config.secrets.awsSecret);
    const { clientId, clientSecret } = JSON.parse(decrypted);
    return { clientId, clientSecret };
}