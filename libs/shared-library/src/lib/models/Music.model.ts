import { model, Schema } from "mongoose"

export type MusicAlbums = {
  albums: MusicAlbum[];
  hasMoreUrl: string;
}


export type MusicAlbum = {
  id: string;
  
  // derived from https://schema.org/MusicAlbum
  image?: string;
  url: string;
  name: string;
  isDirty?: boolean;
  updated?: number;
}

export type MusicRecording = {
  albumId: string;
  id: string;
  name: string;
  image: string;
  serviceUrl: string;
  // derived from https://schema.org/MusicRecording
  duration: string;
  isDirty?: boolean;
  updated?: number;
}

const MusicAlbumSchema = new Schema<MusicAlbum>({
  id: { type: String, required: true },  
  image: String,  
  url: { type: String, required: true },  
  name: { type: String, required: true },
  isDirty: Boolean,
  updated: { type: Number, required: true }
});

const MusicRecordingSchema = new Schema<MusicRecording>({
  albumId: { type: String, required: true },  
  id: { type: String, required: true },  
  name: { type: String, required: true },  
  image: String,
  serviceUrl: { type: String, required: true },  
  duration: String,
  isDirty: Boolean,
  updated: { type: Number, required: true }
});

export const MusicAlbumModel = model<MusicAlbum>('music_album', MusicAlbumSchema);
export const MusicRecordingModel = model<MusicRecording>('music_recording', MusicRecordingSchema);
