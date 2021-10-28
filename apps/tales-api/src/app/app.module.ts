import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { AlbumsModule } from './albums/albums.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => { 
        return {
          uri: configService.get<string>('dbConn'),
        };
      },
      inject: [ConfigService],
    }),
    AlbumsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
