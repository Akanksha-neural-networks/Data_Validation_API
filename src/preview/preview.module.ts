import { Module } from '@nestjs/common';
import { PreviewController } from './preview.controller';
import { PreviewService } from './preview.service';
import { Postgresmodule } from 'src/postgres/postgres.module';
import { Mysqlmodule } from 'src/mysql/mysql.module';
import { SnowflakeModule } from 'src/snowflake/snowflake.module';

@Module({
  imports:[Postgresmodule,Mysqlmodule,SnowflakeModule],
  controllers: [PreviewController],
  providers: [PreviewService]
})
export class PreviewModule {}
