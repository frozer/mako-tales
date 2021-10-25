import { ICrowler } from "../crawlers/Common.crawler";

/* load requests one-by-one */
export class LoaderService {
  async *load<T>(p: ICrowler<T>[]): AsyncGenerator<T[][]> {
    const datasource = this.getDataLoadSequence(p);
    
    for await (const data of datasource) {
      yield data as T[][];
    }
  }

  private async *getDataLoadSequence(seq: ICrowler<unknown>[]) {
    let i = 0;
    while (i < seq.length) {
      const data = await seq[i].crawl();
  
      yield data;
  
      i++;
    }
  }
}