import * as winston from "winston";
import { CheerioAPI } from "cheerio";
import { IContentParser } from ".";
import { ParsedData } from "../crawlers/Common.crawler";
import { HtmlParserInjector } from "../injectors/HTMLParser.injector";
import { MusicRecording } from "../models/Music.model";
import { Logger } from "../services/logger.service";

const IMAGE_CONTAINTER_CLASS = '.podcasts__item-pic';
const NAME_CONTAINTER_CLASS = '.podcasts__item-name';
const DURATION_CONTAINTER_CLASS = '.podcasts__item-timer';
const NEXT_PAGE_PATHNAME = '/more_podcast/uid';
const NEXT_PAGE_QUERY_FIELD = 'page';
const NO_MORE_PAGES_MARKER = '.podcast__list_Btn{display:none;}';

/* https://www.deti.fm/podcast__player/album/114343/uid/796544/isajax/1?_=1635007242748 */
/*  <audio 
                id="player_796544" 
                src="https://101.ru/vardata/modules/musicdb/files/202110/42/fc28af0a3ec172beee84fb51cbe1e471.mp3" 
                data-progress="true" 
                data-type="audio/mpeg" 
                preload="none"
                data-pause="true"></audio> */

export class MusicAlbumParser implements IContentParser<MusicRecording[]> {
  private currentPage = 1;

  constructor(
    private albumId: string,
    private htmlParser = HtmlParserInjector(),
    private logger: winston.Logger = Logger.getInstance()
  ) {}

  parse(data: string): ParsedData<MusicRecording[]> {
    const res = {
      data: [],
      hasMoreUrl: ''
    };

    const $ = this.htmlParser.load(data);

    $('.podcasts__item').map((...args) => {
      const [, el] = args;
      const rec: MusicRecording = {
        albumId: this.albumId,
        id: this.getId($(el)),
        name: this.getName($(el)),
        image: this.getImage($(el)),  
        duration: this.getDuration($(el)),
        serviceUrl: ''
      };
      
      rec.serviceUrl = (rec.id && this.albumId) 
        ? `https://www.deti.fm/podcast__player/album/${this.albumId}/uid/${rec.id}/isajax/1`
        : '';

      res.data.push(rec);
    });

    res.hasMoreUrl = this.getNextPageUrl($);

    return res;
  }

  private getId(el): string {
    return el.attr('id').replace(/\D/g, '').trim();
  }

  private getImage(el): string {
    const imgSrc = el.find(IMAGE_CONTAINTER_CLASS).attr('src');
    try {
      const imgUrl = new URL(imgSrc);
      imgUrl.search = '';

      return imgUrl.toString();
    } catch(e) {
      this.logger.error(`Failed to parse image url - ${imgSrc}, ${e.message}`);
    }

    return '';
  }

  private getName(el): string {
    return el.find(NAME_CONTAINTER_CLASS).text().trim();
  }

  private getDuration(el): string {
    return el.find(DURATION_CONTAINTER_CLASS).text().trim();
  }

  private getNextPageUrl($: CheerioAPI) {
    this.currentPage++;
    
    if ($('style').contents().text() !== NO_MORE_PAGES_MARKER) {
      return `${NEXT_PAGE_PATHNAME}/${this.albumId}?${NEXT_PAGE_QUERY_FIELD}=${this.currentPage}`;
    }

    return '';
  }
}