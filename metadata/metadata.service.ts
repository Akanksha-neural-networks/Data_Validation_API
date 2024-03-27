import { Injectable } from '@nestjs/common';
import {
  Controller,
  Get,
  Query,
  OnApplicationShutdown,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { MysqlService } from 'src/mysql/mysql.service';
import { PostgresService } from 'src/postgres/postgres.service';
import { SnowflakeService } from 'src/snowflake/snowflake.service';

@Injectable()
export class MetadataService {
  private queries: { [key: string]: string };

  constructor(
    private readonly snowflakeService: SnowflakeService,
    private readonly mysqlService: MysqlService,
    private readonly postgresService: PostgresService,
  ) {
    this.queries = this.readQueriesFromFile();
  }

  private readQueriesFromFile(): { [key: string]: string } {
    const filePath = path.resolve(
      process.cwd(),
      'src',
      'metadata',
      'resources',
      'metadata-queries.json',
    );
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  async getMetadata(@Query('source') source: string): Promise<any> {
    try {
      if (!source || !this.queries[source]) {
        throw new NotFoundException('Invalid or missing source');
      }
      const query = this.queries[source];
      console.log({ query });
      switch (source) {
        case 'snowflake':
          return await this.snowflakeService.executeMetaDataQuery(query);
        case 'mysql':
          return await this.mysqlService.executeMetaDataQuery(query);
        case 'postgres':
          return await this.postgresService.executeMetaDataQuery(query);
        default:
          throw new NotFoundException('Invalid source');
      }
    } catch (error) {
      console.error('Error executing query:', error);
      throw new NotFoundException('Failed to execute query');
    }
  }
}
