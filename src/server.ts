import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';

import config from './config/config';
import logging from './config/logging';
import authRouter from './routes/auth.route';
import mboxFilesHandlerRoute from './routes/mboxFilesHandler.route';

const NAMESPACE = 'Server';

const router = express();

router.use(cors());

/** Logging the request */
router.use((req, res, next) => {
    logging.info(`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`, { label: NAMESPACE });

    res.on('finish', () => {
        logging.info(`METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`, { label: NAMESPACE });
    });

    next();
});

/**Parse the request */
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use('/auth', authRouter);
router.use('/mbox', mboxFilesHandlerRoute);

/** Rules of our API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }

    next();
});

const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => {
    logging.info(`Server running on ${config.server.hostname}:${config.server.port}`, { label: NAMESPACE });
});
