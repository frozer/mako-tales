import { CheerioAPI } from "cheerio";

import { IContentParser } from ".";
import { ParsedData } from "../crawlers/Common.crawler";
import { HtmlParserInjector } from "../injectors/HTMLParser.injector";
import { MusicAlbum } from "../models/Music.model";

export class MusicAlbumsParser implements IContentParser<MusicAlbum[]> {
  constructor(
    private htmlParser = HtmlParserInjector()
    ) {}

  parse(data: string): ParsedData<MusicAlbum[]> {
    const res = {
      data: [],
      hasMoreUrl: ''
    };

    const $ = this.htmlParser.load(data);

    $('[itemProp="inAlbum"][itemtype="https://schema.org/MusicAlbum"]').map((...args) => {
      const [, el] = args;
      const album: MusicAlbum = {
        id: '',
        image: '',
        name: '',
        url: ''
      };

      $(el).children().each((...childArgs) => {
        const [, metaEl] = childArgs;
        const name = $(metaEl).attr('itemprop');
        const value = $(metaEl).attr('content');

        if (name && value) {
          album[name] = value;
        }
        
      });

      album.id = this.getIdFromUrl(album.url || '');

      res.data.push(album);
    });
    
   
    res.hasMoreUrl = this.getNextPageUrl($);

    return res;
  }

  private getIdFromUrl(url: string): string {
    return url.replace(/\D/g, '').trim();
  }

  private getNextPageUrl($: CheerioAPI) {
     // pagination analysis
    const pages = [];
    $('.default_page').children().each((...args) => {
      const [, el] = args;
      const url = $(el).attr('href') || '';
      pages.push(url);
    });

    const currentPage = pages.indexOf('');
    return currentPage + 1 < pages.length ? pages[currentPage + 1] : '';
  }
}