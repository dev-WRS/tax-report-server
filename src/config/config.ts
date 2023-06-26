import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const FRONT_PORT = process.env.SERVER_PORT || 4200;
const JWT_SECRET = process.env.JWT_SECRET || 'WRS-TAX-REPORT-API';
const MAIL_SECRET = process.env.MAIL_SECRET || 'cfb1da26677755c8fcf863d97c909865.09066923561cdd10b1423fc52958822c294a65142e585704304f1e3aa8173c118a3c1f8c72871585f59bd5ddd7c5ab86aae56495ff0a9ced622f5ec7fd0cad223aa7c647346a0a5d58d4989ae47e5a842a2226192a0766b460eaac0c9af5a3f8d79afb8f1350c6167c7d4f48f3ef5492bfab33727c561768ab741771b20c62cd0a2cd34bee21214f9cd2c92b98d9a634ecc3f958111a56f95ca2'
const SMTP_SENDER = process.env.SMTP_SENDER || 'Walker Reid Strategies" <no-reply@walkerreid.com>'
const PHRASE = process.env.PHRASE || 'cbccc26abe0bf86da100afbed0886e10f9409e0f5663295a5b055b2d1edb3dcd'
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = process.env.SMTP_PORT || 465
const BUCKET_NAME = process.env.BUCKET_NAME || 'rgapp-assets-bucket-production'
const DEFAULT_REGION = process.env.DEFAULT_REGION || 'us-east-1'
const DEFAULT_FILES_ACL = process.env.DEFAULT_FILES_ACL || 'public-read-write'
const AWS_SECRET = process.env.AWS_SECRET || '113b1cec265cad6042ce85fcc0b6efe1.7eac1642d49b238ada8f199cc2b85cf113a3349d4debb9b1b4c474105c27845a0549e2cf65a693d4f474eec41d129c0d3ebbdb5c9e7c38925eedfaf4b8ccf0fead8ef3e46233bab1af80d1448a5ae712c6e847af701e5a45985c880754'

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    frontEndPort: FRONT_PORT
};

const SECRETS = {
    jwtSecret: JWT_SECRET,
    mailSecret: MAIL_SECRET,
    phrase: PHRASE,
    awsSecret: AWS_SECRET,
}

const SMTP = {
    sender: SMTP_SENDER,
    host: SMTP_HOST,
    port: SMTP_PORT,
}

const S3_BUCKET = {
    bucketName: BUCKET_NAME,
    defaultRegion: DEFAULT_REGION,
    defaultFilesACL: DEFAULT_FILES_ACL
}

const config = {
    server: SERVER,
    secrets: SECRETS,
    smtp: SMTP,
    drive: S3_BUCKET
};

export default config;
