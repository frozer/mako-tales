import { connect, disconnect } from "mongoose";
import { Logger } from "./logger.service";

export class DatabaseService {
  constructor(private logger = Logger.getInstance()) {}

  async connect(dbConnConfig: string) {
    try {
      await connect(dbConnConfig, {
        useNewUrlParser: true,
        useUnifiedTopology: true 
      });
      
      this.logger.debug('Connection established ' + dbConnConfig);

    } catch (e) {
      this.logger.error('Unable to connect to database ' + dbConnConfig + ' ' + e.message);
    }
  }

  async disconnect() {
    try {
      await disconnect();
    } catch (e) {
      this.logger.error('Unable to disconnect from database ' + e.message);
    }
  }
}