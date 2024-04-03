import { Module } from '@nestjs/common';
import { Postgresmodule } from './postgres/postgres.module';
import { Mysqlmodule } from './mysql/mysql.module';
import { SnowflakeModule } from './snowflake/snowflake.module';
import { PreviewModule } from './preview/preview.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { MetadataModule } from 'src/metadata/metadata.module';
import { CountModule } from './count/count.module';

@Module({
  imports: [
    Postgresmodule,
    Mysqlmodule,
    SnowflakeModule,
    PreviewModule,
    MetadataModule,
    CountModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [],
  providers: [],
})
export class RootModule {}
