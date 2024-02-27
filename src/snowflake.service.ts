import { Injectable } from '@nestjs/common';
import *  as snowflake from 'snowflake-sdk';

@Injectable()
export class SnowflakeService {

    private connection;
  
    constructor() {
      this.connection = snowflake.createConnection({
        account: 'ty74166',
        username: 'NANDINI4',
        password: 'Nandini407@',
        region: 'ap-southeast-1',
        database: 'GARDEN',
        schema: 'VEGGIES',
        authenticator: 'SNOWFLAKE'
      });
    }
  
    async connect() {
      return new Promise((resolve, reject) => {

        this.connection.connect((err, conn) => {
          if (err) {
            reject(err);
          } else {
            resolve(conn);
          }
        });
        
      });
    }
  
    async executeQuery(sqlText: string): Promise<any[]> {
      return new Promise((resolve, reject) => {
        this.connection.execute({
          sqlText,
          complete: (err, stmt, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          }
        });
      });
    }
  }
