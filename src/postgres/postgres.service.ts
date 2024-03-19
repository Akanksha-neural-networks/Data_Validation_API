import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from "pg";

@Injectable()
export class PostgresService {
  private client: Client;
  private postgresConfig=this.configService.get<any>('postgres');


  constructor(private readonly configService:ConfigService) {
    
    // this.client = new Client({
    //   user: postgresConfig.username,
    //   host: postgresConfig.host,
    //   database: postgresConfig.database,
    //   password: postgresConfig.password,
    //   port: postgresConfig.port,
    // });

    // new Promise(async(resolve,reject)=>{
    //     try {
    //         await this.client.connect();
    //         console.log("Successfully connected to Postgres !!!");
            
    //     } catch (error) {
    //         console.log("unable to connect to postgres: ",error.message);
            
    //     }
    // })

  }

  async connect(database:string){

    this.client = new Client({
      user: this.postgresConfig.username,
      host: this.postgresConfig.host,
      password: this.postgresConfig.password,
      database,
      port: this.postgresConfig.port,
    });

    new Promise(async(resolve,reject)=>{
        try {
            await this.client.connect();
            console.log("Successfully connected to Postgres !!!");
            
        } catch (error) {
            console.log("unable to connect to postgres: ",error.message);
            
        }
    })

  }

  async executeQuery(database:string,table:string): Promise<any[]> {

    await this.connect(database);

    try {
      const result = await this.client.query(`select * from ${table}`);
      return result.rows;
    } 
    catch (error) {
      console.log(`Failed to fetch data from PostgreSQL: ${error.message}`);
      throw new error(error);
    }
  }
}
