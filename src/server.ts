import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoose from 'mongoose';

import config from './config/config';
import authRouter from './routes/auth.route';
import mboxFilesHandlerRoute from './routes/mboxFilesHandler.route';


const NAMESPACE = 'Server';

const app = express();
app.use(cors({credentials: true}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const httpServer = http.createServer(app);

httpServer.listen(config.server.port, () => {
    logging.info(`Server running on ${config.server.hostname}:${config.server.port}`, { label: NAMESPACE });
});

const MONGO_URL = 'mongodb://localhost:27017/wrs_tax_report';
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL, {useNewUrlParser: true});
mongoose.connection.on('error', (error: Error) => {
    console.log(error);
})

const db = 'mongodb://localhost:27017/wrs_tax_report';
const mongoose = require('mongoose');
mongoose.connect(db, (err: string) => {
    if (err) {
        console.error('Error!' + err)
    } else {
        console.log('Connected to mongodb')
    }
});

/** Logging the request */
app.use((req, res, next) => {
    logging.info(`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`, { label: NAMESPACE });

    res.on('finish', () => {
        logging.info(`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`, { label: NAMESPACE });
    });

    next();
});

/** Rules of our API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }

    next();
});

app.use('/auth', authRouter);
app.use('/mbox', mboxFilesHandlerRoute);
