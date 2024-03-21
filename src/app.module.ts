import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
//import { SnowflakeService } from './snowflake/snowflake.service';
//import { PostgresService } from './postgres/postgres.service';
//import { MysqlService } from './mysql/mysql.service';
import { MetadataModule } from './metadata/metadata.module';

@Module({
  imports: [MetadataModule],
  controllers: [AppController],
  providers: [AppService],
    
  //SnowflakeService, PostgresService, MysqlService],
})
export class AppModule {}
