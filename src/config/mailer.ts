import nodemailer from 'nodemailer';

import { decrypt } from '../helper';
import config from '../config/config';

let transporterConfig = getValuesFromEncryptedConfig();

function getValuesFromEncryptedConfig() {
    const decrypted = decrypt(config.secrets.phrase, config.secrets.mailSecret);
    const { host, port, user, pass, secure } = JSON.parse(decrypted);
    return { host, port, user, pass, secure };
}

export const transporter = nodemailer.createTransport({
    host: transporterConfig.host,
    port: transporterConfig.port,
    secure: transporterConfig.secure,
    auth: {
        user: transporterConfig.user,
        pass: transporterConfig.pass
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});
