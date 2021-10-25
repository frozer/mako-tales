import * as winston from "winston";
import { HttpClientInjector } from "../injectors/HttpClient.injector";
import { IContentParser } from "../parsers";
import { Logger } from "../services/logger.service";

export interface ICrowler<T> {
  crawl(): Promise<T[]>;
}

export type ParsedData<T> = {
  data: T;
  hasMoreUrl: string
}

export class CommonCrawler<T> implements ICrowler<T> {
  private url: URL;
  
  constructor(
    rootUrl: string,
    private contentParser: IContentParser<T>, 
    private httpClient = HttpClientInjector(),
    private logger: winston.Logger = Logger.getInstance()
    ) {
      this.url = new URL(rootUrl);
    }

  async crawl() {
   
    const datasource = this.getDatasource(this.url.toString());

    const res = [];
  
    for await (const value of datasource) {
      res.push(value);
    }
    
    return res;
  }

  private async *getDatasource(url: string) {
    let nextPageUrl = url;

    while (nextPageUrl) {
      try {
        this.logger.info('Requesting... ' + nextPageUrl);

        const response = await this.httpClient.get<string>(nextPageUrl, {
          headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36' }
          });
        const {hasMoreUrl, data} = this.contentParser.parse(response.data);
        
        nextPageUrl = this.handleNextPageUrl(hasMoreUrl);

        yield data;

      } catch (e) {
        this.logger.error(`Crawler ${nextPageUrl} load failed: ${e.message}`);
        nextPageUrl = '';
      }     
    }
  }

  private handleNextPageUrl(url: string): string {
    if (url) {
      try {
        const tempUrl = new URL(url);
        return tempUrl.toString();
      } catch (e) {
        this.logger.debug(`Failed to parse next page url - ${url}, ${e.message}`);
      }

      const nextUrl = new URL(this.url.toString());
      const queryPos = url.indexOf('?');
      if (queryPos !== -1) {
        const pathname = url.slice(0, queryPos);
        const searchParams = new URLSearchParams(url.slice(queryPos));
        searchParams.forEach((value,key) => {
          nextUrl.searchParams.set(key, value);
        });
        nextUrl.pathname = pathname;
      } else { 
        nextUrl.pathname = url;
      }

      return nextUrl.toString();
    } else {
      return '';
    }
  }
}