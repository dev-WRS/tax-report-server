import winston from 'winston';
import { MongoDBTransportInstance } from "winston-mongodb";

const { MongoDB }: { MongoDB: MongoDBTransportInstance } = require("winston-mongodb");

export const logger = winston.createLogger(
    {
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf((info) => `${info.timestamp} - [${info.label}] - ${info.level}: ${info.message}`)
        ),
        transports: [
            new winston.transports.Console(), 
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log' }),
            new winston.transports.MongoDB({
                db: 'mongodb://localhost:27017/wrs_tax_report',
                options: { useNewUrlParser: true, useUnifiedTopology: true },
                collection: 'logs',
            }),
        ]
    }
);
