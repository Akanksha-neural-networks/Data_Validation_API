import { Injectable } from '@nestjs/common';
import * as snowflake from 'snowflake-sdk';
import * as fs from 'fs';

@Injectable()
export class SnowflakeService {
  private connection;

  constructor() {
    const config = this.loadConfigFromFile('src/snowflakeConfig.json');
    this.connection = snowflake.createConnection({
      account: config.account,
      username: config.username,
      password: config.password,
      warehouse: config.warehouse,
      database: config.database,
      role: config.role,
    });
    this.connect();
  }

  private loadConfigFromFile(filePath: string): any {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data.toString());
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.connect((err, conn) => {
        if (err) {
          console.error('Error connecting to Snowflake:', err);
          reject(err);
        } else {
          console.log('Successfully connected to Snowflake.');
          resolve();
        }
      });
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.connection) {
        this.connection.destroy((err) => {
          if (err) {
            console.error('Error disconnecting from Snowflake:', err.message);
          } else {
            console.log('Disconnected from Snowflake.');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  async executeQuery(
    query: string,
    withSchemasAndTables: boolean = false,
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.connection) {
        reject('Not connected to Snowflake.');
        return;
      }
      this.connection.execute({
        sqlText: query,
        complete: async (err, stmt, rows) => {
          if (err) {
            reject(err);
          } else {
            if (withSchemasAndTables) {
              const databasesWithSchemasAndTables = [];
              for (const row of rows) {
                const database = row.DATABASE_NAME;
                const schemasQuery = `SHOW SCHEMAS IN DATABASE ${database}`;
                const schemas = await this.executeQuery(schemasQuery);
                const schemasWithTables = await Promise.all(
                  schemas.map(async (schema: any) => {
                    const tablesQuery = `SHOW TABLES IN SCHEMA ${schema.name}`;
                    const tables = await this.executeQuery(tablesQuery);
                    return {
                      schema: schema.name,
                      tables: tables.map((table: any) => table.name),
                    };
                  }),
                );
                databasesWithSchemasAndTables.push({
                  database,
                  schemas: schemasWithTables,
                });
              }
              resolve(databasesWithSchemasAndTables);
            } else {
              resolve(rows);
            }
          }
        },
      });
    });
  }
}
