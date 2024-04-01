import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as snowflake from 'snowflake-sdk';

@Injectable()
export class SnowflakeService {
  private connection;

  constructor(private readonly configService: ConfigService) {}

  async connect(database: string, schema: string) {
    this.connection = snowflake.createConnection({
      account: this.configService.get<string>('snowflake.account'),
      username: this.configService.get<string>('snowflake.username'),
      password: this.configService.get<string>('snowflake.password'),
      region: this.configService.get<string>('snowflake.region'),
      database:
        database || this.configService.get<string>('snowflake.database'),
      schema: schema || this.configService.get<string>('snowflake.schema'),
      authenticator: this.configService.get<string>('snowflake.authenticator'),
    });

    new Promise((resolve, reject) => {
      this.connection.connect((err, conn) => {
        if (err) {
          console.log('unable to connect to sno: ' + err.message);
          reject(err.message);
        } else {
          console.log('successfully connected to snowflake!!');
          resolve(conn);
        }
      });
    });
  }

  async executeQuery(
    sqlQuery: string,
    database: string = null,
    schema: string = null,
  ): Promise<any[]> {
    await this.connect(database, schema);

    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText: sqlQuery,
        complete: (err, stmt, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        },
      });
    });
  }
}
