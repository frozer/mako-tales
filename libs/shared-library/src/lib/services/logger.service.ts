import * as winston from "winston";
const { combine, timestamp, json } = winston.format;

export class Logger {
  private static instance: winston.Logger;

  static getInstance(logLevel?: string) {
    if (!this.instance) {
      this.instance = winston.createLogger({
        level: logLevel || 'info',
        format: combine(timestamp(), json()),
        defaultMeta: { service: 'talecrawler-service' },
        transports: [
          new winston.transports.File({ filename: 'error.log', level: 'error' }),
          new winston.transports.File({ filename: 'combined.log' }),
        ],
      });

      if (process.env.NODE_ENV !== 'production') {
        this.instance.add(new winston.transports.Console({
          format: winston.format.simple(),
        }));
      }
    }

    return this.instance;
  }
}