import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql';
import * as fs from 'fs';

@Injectable()
export class MysqlService {
  private connection;

  constructor() {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'omsairam',
      database: 'College',
    });
    this.connect();
    //const config = this.loadConfigFromFile('src/mysqlConfig.json');
    //this.connection = mysql.createConnection({
    //host: config.host,
    //user: config.user,
    //   password: config.password,
    //   database: config.database,
    // });
    // this.connect();
  }

  // private loadConfigFromFile(filePath: string): any {
  //   const data = fs.readFileSync(filePath);
  //   return JSON.parse(data.toString());
  // }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) {
          console.error('Error connecting to MySQL:', err);
          reject(err);
        } else {
          console.log('Successfully connected to MySQL.');
          resolve();
        }
      });
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.connection) {
        this.connection.end((err) => {
          if (err) {
            console.error('Error disconnecting from MySQL:', err.message);
          } else {
            console.log('Disconnected from MySQL.');
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
    withTables: boolean = false,
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.connection) {
        reject('Not connected to MySQL.');
        return;
      }
      this.connection.query(query, async (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (withTables) {
            const databasesWithTables = [];
            for (const row of results) {
              const database = row.Database;
              const tablesQuery = `USE ${database}; SHOW TABLES;`;
              const tables = await this.executeQuery(tablesQuery);
              databasesWithTables.push({ database, tables });
            }
            resolve(databasesWithTables);
          } else {
            resolve(results);
          }
        }
      });
    });
  }
}
