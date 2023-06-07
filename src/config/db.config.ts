import { connect } from 'mongoose'
import logger from '../utils/logging'

const connectDb = async (URL: string) => {
    try {
      const connection: any = await connect(URL);
      logger.info(`Mongo DB is connected to: ${connection.connection.host}`);
    } catch (err) {
      logger.error(`An error ocurred\n\r\n\r${err}`);
    }
  }
  
export default connectDb;