import { Injectable } from '@nestjs/common';
import { MysqlService } from 'src/mysql/mysql.service';
import { PostgresService } from 'src/postgres/postgres.service';
import { SnowflakeService } from 'src/snowflake/snowflake.service';
import { CommonColumnsDto } from './dto/common-columns.dto';

@Injectable()
export class CommonColumnsService {
  constructor(
    private readonly mysqlService: MysqlService,
    private readonly postgresService: PostgresService,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async getColumns(data: CommonColumnsDto[]): Promise<any> {
    const allColumns = [];
    for (const request of data) {
      let query;
      let columns;
      switch (request.engine) {
        case 'mysql':
          query = `SHOW COLUMNS FROM ${request.database}.${request.table}`;
          columns = await this.mysqlService.executeQuery(
            query,
            request.database,
          );
          // Extract only column names
          const columnNames = columns.map((col) => col.Field);
          allColumns.push({ engine: request.engine, data: columnNames });
          break;
        case 'postgres':
          query = `SELECT column_name FROM information_schema.columns WHERE table_name = '${request.table}'`;
          columns = await this.postgresService.executeQuery(
            query,
            request.database,
          );
          // Extract only column names
          const columnNamesPostgres = columns.map((col) => col.column_name);
          allColumns.push({
            engine: request.engine,
            data: columnNamesPostgres,
          });
          break;
        case 'snowflake':
          query = `DESCRIBE TABLE ${request.database}.public.${request.table}`;
          columns = await this.snowflakeService.executeQuery(
            query,
            request.database,
          );
          // Extract only column names
          const columnNamesSnowflake = columns.map((col) => col.name);
          allColumns.push({
            engine: request.engine,
            data: columnNamesSnowflake,
          });
          break;
        default:
          throw new Error('Unsupported database engine');
      }
    }

    const commonColumns = this.findCommonColumns(
      allColumns.map(({ data }) => data),
    );

    return {
      'all-columns': allColumns,
      'common-columns': commonColumns,
    };
  }

  private findCommonColumns(columnsPerTable: string[][]): string[] {
    const firstTableColumns = columnsPerTable[0];
    const commonColumns = firstTableColumns.filter((column) => {
      return columnsPerTable.every((columns) => columns.includes(column));
    });
    return commonColumns;
  }
}
