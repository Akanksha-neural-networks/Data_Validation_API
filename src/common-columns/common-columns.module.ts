import { Module } from '@nestjs/common';
import { CommonColumnsController } from './common-columns.controller';
import { CommonColumnsService } from './common-columns.service';
import { Mysqlmodule } from 'src/mysql/mysql.module';
import { Postgresmodule } from 'src/postgres/postgres.module';
import { SnowflakeModule } from 'src/snowflake/snowflake.module';

@Module({
  imports: [Postgresmodule, Mysqlmodule, SnowflakeModule],
  controllers: [CommonColumnsController],
  providers: [CommonColumnsService],
})
export class CommonColumnsModule {}
