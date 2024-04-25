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
    if(data.length!==2) return {status:400, error:'Two data sources are allowed!'};

    const allColumns = [];
    for (const request of data) {
      let query;
      let columns;
      switch (request.engine) {
        case 'mysql':
          // query = `SHOW COLUMNS FROM ${request.database}.${request.table}`;
          query = `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${request.database}' AND TABLE_NAME = '${request.table}';`;
          columns = await this.mysqlService.executeQuery(
            query,
            request.database,
          );
          // Extract only column names
          const columnNames = columns.map((col) => ({
            column: col.COLUMN_NAME,
            dataType: col.DATA_TYPE,
          }));
          allColumns.push({ engine: request.engine, data: columnNames });
          break;
        case 'postgres':
          // query = `SELECT column_name FROM information_schema.columns WHERE table_name = '${request.table}'`;
          query = `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${request.table}'`;
          if (request.schema)
            query += ` and table_schema = '${request.schema}'`;
          columns = await this.postgresService.executeQuery(
            query,
            request.database,
          );
          // Extract only column names
          const columnNamesPostgres = columns.map((col) => ({
            column: col.column_name,
            dataType: col.data_type,
          }));
          allColumns.push({
            engine: request.engine,
            data: columnNamesPostgres,
          });
          break;
        case 'snowflake':
          query = `DESCRIBE TABLE ${request.database}.${request.schema}.${request.table}`;
          columns = await this.snowflakeService.executeQuery(
            query,
            request.database,
          );
          // Extract only column names
          const columnNamesSnowflake = columns.map((col) => ({
            column: col.name,
            dataType: col.type,
          }));
          allColumns.push({
            engine: request.engine,
            data: columnNamesSnowflake,
          });
          break;
        default:
          throw new Error('Unsupported database engine');
      }
    }

    const commonColumns = this.findCommonColumns(allColumns);

    return {
      allColumns: allColumns,
      commonColumns: commonColumns,
    };
  }

  private findCommonColumns(
    allColumns: {
      engine: string;
      data: { column: string; dataType: string }[];
    }[],
  ): { column: string; [key: string]: string }[] {
    const firstTableData = allColumns[0];
    const result = firstTableData.data.map(({ column, dataType }) => {
      const val = allColumns[1].data.find((tbl2) => tbl2.column.toLowerCase() === column.toLowerCase());
      if (!val) return;
      return {
        column: val.column,
        [`source_one_${firstTableData.engine}_datatype`]: dataType,
        [`source_two_${allColumns[1].engine}_datatype`]: val.dataType,
      };
    }); 
    return result.filter(Boolean);
  }
}
