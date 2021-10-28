
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop()
  id: string;
  
  @Prop()
  image: string;

  @Prop()
  url: string;

  @Prop()
  name: string;

  @Prop()
  isDirty: boolean;

  @Prop()
  updated: number;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);