import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { SnowflakeService } from './snowflake.service';

@Controller('snowflake')
export class SnowflakeController {
  constructor(private snowflakeService: SnowflakeService) {}
}
