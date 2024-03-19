import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as mysql from "mysql2/promise";

@Injectable()
export class MysqlService {

    private connection: any; 
    private mysqlService=this.configService.get<any>('mysql');

    constructor(private readonly configService:ConfigService) {

    //   this.mysqlService=this.configService.get<any>('mysql');
    //   console.log("mysql creds->",this.mysqlService);

    //   this.initConnection();


    }


    async connect(database:string) {
        try {
            const pool = await mysql.createPool({
                host: this.mysqlService.host,
                port: this.mysqlService.port,
                user: this.mysqlService.user,
                password: this.mysqlService.password,
                database,
            });

            this.connection = pool;
            await this.testConnection();    
             
        } 
        
        catch (err) {
            console.error('Unable to connect to MySQL Db:', err);
        }
    }


    private async testConnection() {
        try {
            await this.connection.query('SELECT 1');
            console.log('Successfully connected to MySQL');
        } catch (error) {
            console.error('unable to connect to mysql:', error);
        }
    }

    async executeQuery(database:string,table:string): Promise<any[]> {
        try {
            await this.connect(database);
            const sqlQuery = `SELECT * FROM ${table}`;
            const [rows] = await this.connection.execute(sqlQuery);
            return rows as any[]; 
        } catch (error) {
            console.error('Error executing MySQL query:', error);
            throw new error(error);
        }
    }
}

