import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AlbumsController } from "./albums.controller";
import { AlbumsService } from "./albums.service";
import { AlbumSchema, RecordingSchema } from "./schemas";

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'music_album', schema: AlbumSchema },
    { name: 'music_recording', schema: RecordingSchema }
  ])],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}