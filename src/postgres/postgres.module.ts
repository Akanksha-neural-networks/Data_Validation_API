import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {default as PostgresConfig} from 'src/config/engine-postgres.config';
import { PostgresService } from './postgres.service';
import { PostgresController } from './postgres.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
          load: [PostgresConfig],
        }),
      
      ],

    controllers:[PostgresController],
    providers:[PostgresService],
    exports:[PostgresService],
    
})



export class Postgresmodule{}