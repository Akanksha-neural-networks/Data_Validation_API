import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class PostgresService {
  private client: Client;
  private postgresConfig = this.configService.get<any>('postgres');

  constructor(private readonly configService: ConfigService) {}

  async connect(database: string) {
    this.client = new Client({
      user: this.postgresConfig.username,
      host: this.postgresConfig.host,
      password: this.postgresConfig.password,
      database: database || this.postgresConfig.database,
      port: this.postgresConfig.port,
    });

    new Promise(async (resolve, reject) => {
      try {
        await this.client.connect();
        console.log('Successfully connected to Postgres !!!');
      } catch (error) {
        console.log('unable to connect to postgres: ', error.message);
      }
    });
  }

  async executeQuery(
    sqlQuery: string,
    database: string = null,
  ): Promise<any[]> {
    await this.connect(database);

    try {
      const result = await this.client.query(sqlQuery);
      return result.rows;
    } catch (error) {
      console.log(`Failed to fetch data from PostgreSQL: ${error.message}`);
      throw new error(error);
    }
  }
}
