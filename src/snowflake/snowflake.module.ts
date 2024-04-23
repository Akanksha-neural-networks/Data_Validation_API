import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

//import {default as SnowflakeConfig} from "../config/engine-snowflake.config";
import { SnowflakeController } from './snowflake.controller';
import { SnowflakeService } from './snowflake.service';

@Module({
  imports: [ConfigModule],
  controllers: [SnowflakeController],
  providers: [SnowflakeService],
  exports: [SnowflakeService],
})
export class SnowflakeModule {}
