import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MysqlService {
  private connection: any;
  private mysqlService = this.configService.get<any>('mysql');

  constructor(private readonly configService: ConfigService) {}

  async connect(database: string) {
    try {
      const pool = await mysql.createPool({
        host: this.mysqlService.host,
        port: this.mysqlService.port,
        user: this.mysqlService.username,
        password: this.mysqlService.password,
        database: database || this.mysqlService.database,
      });

      this.connection = pool;
    } catch (err) {
      console.error('Unable to connect to MySQL Db:', err);
    }
  }

  async executeQuery(
    sqlQuery: string,
    database: string = null,
  ): Promise<any[]> {
    try {
      await this.connect(database);
      const [rows] = await this.connection.execute(sqlQuery);
      return rows as any[];
    } catch (error) {
      console.error('Error executing MySQL query:', error);
      throw new error(error);
    }
  }
}
