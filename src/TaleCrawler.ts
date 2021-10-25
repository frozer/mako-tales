import * as winston from "winston";

import { CommonCrawler, ICrowler } from "./crawlers/Common.crawler";

import { MusicAlbum, MusicAlbumModel, MusicRecording, MusicRecordingModel } from "./models/Music.model";

import { MusicAlbumParser } from "./parsers/MusicAlbum.parser";
import { MusicAlbumsParser } from "./parsers/MusicAlbums.parser";

import { ConfigurationService } from "./services/configuration.service";
import { DatabaseService } from "./services/database.service";
import { LoaderService } from "./services/Loader.service";
import { Logger } from "./services/logger.service";

export class TaleCrawler {
  constructor(
    private config: ConfigurationService,
    private logger: winston.Logger = Logger.getInstance(),
    private loaderService = new LoaderService(),
    private databaseService = new DatabaseService
    ) {
      this.logger.level = this.config.getConfig().logLevel || 'info';
    }

  async init() {
    await this.databaseService.connect(this.config.getConfig().dbConn);
  }

  async fetch(): Promise<MusicRecording[]> {
    await this.markAllRecordsAsDirty();

    const musicAlbums = await this.fetchAlbums();

    const crawlAlbumsRecordings = musicAlbums
      .filter((album: MusicAlbum) => Boolean(album.id && album.url))
      .filter(album => album.id === '114343')
      .map(album => new CommonCrawler<MusicRecording[]>(album.url, new MusicAlbumParser(album.id)));

    this.logger.info(`Total ${musicAlbums.length} albums received`);
    this.logger.info(`${crawlAlbumsRecordings.length} albums going to be crawled`);

    const records = this.fetchRecords(crawlAlbumsRecordings);

    for await (const albumRecords of records) {
      await this.storeRecords(albumRecords.reduce((acc, recsPerPage) => acc.concat(recsPerPage), []));
    }

    await this.storeAlbums(musicAlbums);

    return null;
  }

  private async *fetchRecords(p: ICrowler<MusicRecording>[]): AsyncGenerator<MusicRecording[][]> {
    const recordsChunk = this.loaderService.load(p)

    for await (const records of recordsChunk) {
      yield records;    
    }
  }

  private async fetchAlbums(): Promise<MusicAlbum[]> {
    const {rootUrl} = this.config.getConfig();
    const musicAlbumsCrawler = new CommonCrawler<MusicAlbum[]>(
      rootUrl,
      new MusicAlbumsParser()
      );
    
    const musicAlbumsPages = await musicAlbumsCrawler.crawl();
    this.logger.info(`${musicAlbumsPages.length} album pages received`);

    this.logger.info('Preparing to load albums...');

    return musicAlbumsPages
      .reduce((acc, albums) => acc.concat(albums), []);
  }

  private async storeAlbums(records: MusicAlbum[]) {
    const updated = Date.now();
    const isDirty = false;

    const p = records.map(rec => MusicAlbumModel.findOneAndUpdate({id: rec.id}, {
      ...rec,
      isDirty,
      updated
    }, { upsert: true }));

    try {
      await Promise.all(p);

      this.logger.info(`${p.length} entries stored`);

    } catch (e) {
      this.logger.error(`Error storing records ${e.message}`);
    }
  }

  private async storeRecords(records: MusicRecording[]) {
    const updated = Date.now();
    const isDirty = false;

    const p = records.map(rec => MusicRecordingModel.findOneAndUpdate({id: rec.id}, {
      ...rec,
      isDirty,
      updated
    }, { upsert: true }));

    try {
      await Promise.all(p);

      this.logger.info(`${p.length} entries stored`);

    } catch (e) {
      this.logger.error(`Error storing records ${e.message}`);
    }
  }

  private async markAllRecordsAsDirty() {
    const isDirty = true;
    try {
      await Promise.all([
        MusicRecordingModel.updateMany({}, {isDirty}),
        MusicAlbumModel.updateMany({}, {isDirty})
      ]);

    } catch (e) {
      this.logger.error(`Error updating records ${e.message}`);
    }
  }
}