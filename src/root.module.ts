import { Module } from '@nestjs/common';
import { Postgresmodule } from './postgres/postgres.module';
import { Mysqlmodule } from './mysql/mysql.module';
import { SnowflakeModule } from './snowflake/snowflake.module';
import { PreviewModule } from './preview/preview.module';


@Module({
  imports:[Postgresmodule,Mysqlmodule,SnowflakeModule,PreviewModule],
  controllers: [],
  providers: [],
})
export class RootModule {}
