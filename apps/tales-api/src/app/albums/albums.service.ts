import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MusicAlbumRecordings } from './models';
import { Album, AlbumDocument, RecordingDocument } from './schemas';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel('music_album') private readonly albumModel: Model<AlbumDocument>,
    @InjectModel('music_recording') private readonly recordingModel: Model<RecordingDocument>
  ) {}

  async getAlbums(): Promise<Album[]> {
    return this.albumModel.find().exec();
  }

  async getAlbum(id: string): Promise<MusicAlbumRecordings> {
    const {id: albumId, name, image, url} = await this.albumModel.findOne({isDirty: false, id}).exec();
    const recordings = await this.recordingModel.find({albumId, isDirty: false}).exec();

    return {
      id: albumId,
      name,
      image,
      url,
      recordings: recordings.map(rec => {
        const {id: recordId, name, image, serviceUrl, duration} = rec;
        return {
          id: recordId,
          albumId,
          name,
          image,
          serviceUrl,
          duration
        }
      })
    };
  }
}
