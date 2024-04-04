import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { MysqlService } from 'src/mysql/mysql.service';
import { PostgresService } from 'src/postgres/postgres.service';
import { SnowflakeService } from 'src/snowflake/snowflake.service';
import { MetadataService } from './metadata.service';

@Controller('metadata')
export class MetadataController {
  

  constructor(private readonly metadataService: MetadataService) {
    
  }

  @Get()
  async getMetadata(@Query('source') source: string): Promise<any> {
    try {
      return await this.metadataService.getMetadata(source);
    } catch (error) {
      console.error('Error executing query:', error);
      throw new NotFoundException('Failed to execute query');
    }
  }
}
