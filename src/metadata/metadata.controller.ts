import {
  Controller,
  Get,
  Query,
  OnApplicationShutdown,
  NotFoundException,
} from '@nestjs/common';
import { MysqlService } from 'src/mysql/mysql.service';
import { PostgresService } from 'src/postgres/postgres.service';
import { SnowflakeService } from 'src/snowflake/snowflake.service';

@Controller('metadata')
export class MetadataController implements OnApplicationShutdown {
  constructor(
    private readonly snowflakeService: SnowflakeService,
    private readonly mysqlService: MysqlService,
    private readonly postgresService: PostgresService,
  ) {}

  @Get()
  async getMetadata(@Query('source') source: string): Promise<any> {
    try {
      let query: string;
      switch (source) {
        case 'snowflake':
          query = `SELECT 
          ARRAY_AGG(
              OBJECT_CONSTRUCT(
                  'database', current_database(),
                  'schemas', SCHEMAS
              )
          ) AS result
      FROM (
          SELECT
              ARRAY_AGG(
                  OBJECT_CONSTRUCT(
                      'schema', TABLE_SCHEMA,
                      'tables', TABLES
                  )
              ) AS SCHEMAS
          FROM (
              SELECT
                  TABLE_SCHEMA,
                  ARRAY_AGG(TABLE_NAME) AS TABLES
              FROM
                  INFORMATION_SCHEMA.TABLES
              WHERE
                  TABLE_SCHEMA NOT IN ('INFORMATION_SCHEMA', 'SYSADMIN', 'ACCOUNT_USAGE', 'ACCOUNT_USAGE_INTERNAL', 'SECURITY_INTEGRATION')
              GROUP BY
                  TABLE_SCHEMA
          )
      );
      `; 
          return await this.snowflakeService.executeQuery(query);
        case 'mysql':
          query = `SELECT JSON_ARRAYAGG(metadata) AS result
          FROM (
              SELECT
                  JSON_OBJECT(
                      'tables', tables,
                      'database', table_schema
                  ) AS metadata
              FROM (
                  SELECT
                      table_schema,
                      JSON_ARRAYAGG(table_name) AS tables
                  FROM
                      information_schema.tables
                  WHERE
                      table_schema NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')
                  GROUP BY
                      table_schema
              ) AS subquery
          ) AS main_query;`; 
          return await this.mysqlService.executeQuery(query);
        case 'postgres':
          query = `SELECT JSON_ARRAYAGG(json_build_object(
            'database', database_name,
            'schemas', schemas
        )) AS result
        FROM (
            SELECT 
                database_name,
                json_agg(json_build_object(
                    'schema', schema_name,
                    'tables', tables
                )) AS schemas
            FROM (
                SELECT
                    table_catalog AS database_name,
                    table_schema AS schema_name,
                    json_agg(table_name) AS tables
                FROM
                    information_schema.tables
                WHERE
                    table_catalog NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')
                GROUP BY
                    table_catalog, table_schema
            ) AS tables_per_schema
            GROUP BY
                database_name
        ) AS databases;
        `;
          return await this.postgresService.executeQuery(query);
        default:
          throw new NotFoundException('Invalid source');
      }
    } catch (error) {
      console.error('Error executing query:', error);
      throw new NotFoundException('Failed to execute query');
    }
  }

  async onApplicationShutdown(signal?: string): Promise<void> {
    await Promise.all([
      this.snowflakeService.disconnect(),
      this.mysqlService.disconnect(),
      this.postgresService.disconnect(),
    ]);
  }
}
