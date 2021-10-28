

import { Controller, Get, Param } from '@nestjs/common';

import { AlbumsService } from './albums.service';
import { MusicAlbumRecordings } from './models';
import { Album } from './schemas';

@Controller('albums')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @Get()
  findAll(): Promise<Album[]> {
    return this.albumsService.getAlbums();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MusicAlbumRecordings> {
    return this.albumsService.getAlbum(id);
  }
}

