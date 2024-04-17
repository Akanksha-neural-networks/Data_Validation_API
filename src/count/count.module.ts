import { Module } from '@nestjs/common';
import { CountController } from './count.controller';
import { CountService } from './count.service';
import { SnowflakeModule } from 'src/snowflake/snowflake.module';
import { Mysqlmodule } from 'src/mysql/mysql.module';
import { Postgresmodule } from 'src/postgres/postgres.module';

@Module({
  imports: [SnowflakeModule,Mysqlmodule,Postgresmodule],
  controllers: [CountController],
  providers: [CountService]
})
export class CountModule {}
