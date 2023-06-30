import { timeStamp } from 'console';
import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  timestamp: Date;
  label: string;
  level: string;
  message: string;
}

const LogSchema: Schema = new Schema({
  timestamp: { type: Date, required: true },
  label: { type: String, required: true },
  level: { type: String, required: true },
  message: { type: String, required: true },
});

export const Log = mongoose.model<ILog>('Log', LogSchema);

export const getLogs = Log.find();

export const getLogsByTimestamp = (timeStamp: Date) => Log.findOne({ timeStamp });

export const createLog = (values: Record<string, any>) => new Log(values).save().then((log) => log.toObject());