
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecordingDocument = Recording & Document;

@Schema()
export class Recording {
  @Prop()
  albumId: string;
  
  @Prop()
  id: string;
  
  @Prop()
  name: string;
  
  @Prop()
  image: string;
  
  @Prop()
  serviceUrl: string;
  
  @Prop()
  duration: string;
  
  @Prop()
  isDirty?: boolean;
  
  @Prop()
  updated?: number;
}

export const RecordingSchema = SchemaFactory.createForClass(Recording);