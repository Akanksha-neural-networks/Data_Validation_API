import { Module } from '@nestjs/common';
import { SnowflakeService } from './snowflake.service';
import { SnowflakeController } from './app.controller';


@Module({
  imports: [],
  controllers: [SnowflakeController],
  providers: [SnowflakeService],
})
export class RootModule {}
