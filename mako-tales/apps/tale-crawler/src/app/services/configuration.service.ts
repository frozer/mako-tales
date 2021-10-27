import * as path from 'path';
import { NConfInjector } from '../injectors/NConf.injector';

export type Configuration = {
  dbConn: string;
  rootUrl: string;
  logLevel?: 'debug' | 'info'
}

export class ConfigurationService {
  private config: Configuration;

  constructor(private nconf = NConfInjector()) {

  }

  getConfig(): Configuration {
    if (!this.config) {
      this.nconf
        .argv()
        .file(path.resolve('cfg', this.nconf.get('config') + '.json'));
      
      this.config = {
        rootUrl: this.nconf.get('rootUrl'),
        dbConn: this.nconf.get('dbConn'),
        logLevel: this.nconf.get('logLevel') || 'info'
      };
    }

    return this.config;
  }
}