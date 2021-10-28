import {MusicAlbum, MusicRecording} from '@tales/shared';

export type MusicAlbumRecordings = Omit<MusicAlbum, 'isDirty'| 'updated'> & {
  recordings: Omit<MusicRecording, 'isDirty' | 'updated'>[];
}