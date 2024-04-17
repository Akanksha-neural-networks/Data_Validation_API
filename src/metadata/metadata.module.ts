import { Module } from '@nestjs/common';
import { MetadataController } from './metadata.controller';
import { MysqlService } from 'src/mysql/mysql.service';
import { PostgresService } from 'src/postgres/postgres.service';
import { SnowflakeService } from 'src/snowflake/snowflake.service';
import { MetadataService } from './metadata.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [MetadataController],
  providers: [SnowflakeService, MysqlService, PostgresService, MetadataService],
})
export class MetadataModule {}
