import { Injectable } from '@nestjs/common';
import { MysqlService } from 'src/mysql/mysql.service';
import { PostgresService } from 'src/postgres/postgres.service';
import { PreviewDto } from 'src/snowflake/dto/preview.dto';
import { SnowflakeService } from 'src/snowflake/snowflake.service';

@Injectable()
export class PreviewService {

    constructor(
        private  postgresService: PostgresService,
        private  mysqlService: MysqlService,
        private  snowflakeService: SnowflakeService,

    ) {}

    
    async previewData(previewDto: PreviewDto[]): Promise<any[]> {
    
        try {

            const result=[];
            await Promise.all (previewDto.map(async (preview:PreviewDto)=>{

            const { engine, database, table,schema } = preview;

            let data;
            switch (engine) {
                case "postgres":
                    // console.log("entered postgresssss->",database,table)
                    try{
                        data= await this.postgresService.executeQuery(database,table,);
                        result.push( {"engine":engine,"data":data} );
                    }
                    catch(error){
                        throw new  Error(`Failed to fetch data from postgres: ${error.message}`);
                    }
                    break;

                case "mysql":
                    console.log("entered mysqllll",database,table)

                    try {
                        data=await this.mysqlService.executeQuery(database,table);
                        result.push( {"engine":engine,"data":data} );
                        
                    } catch (error) {
                        throw new  Error(`Failed to fetch data from mysql: ${error.message}`);
                        
                    }
                    break;

                case "snowflake":
                    console.log("entered snowflakeee",database,table)

                    try {
                        data = await this.snowflakeService.executeQuery(database,schema,table);
                        result.push( {"engine":engine,"data":data} );
                    } 
                    catch (error) {
                        throw new  Error(`Failed to fetch data from snowflake: ${error.message}`);
                    }

                    break;

                default:
                    throw new Error(`Unsupported engine type: ${engine}`);
            }

            


            }) );

            return result;

          
        } 
        
        catch (error) {
            throw error;
        }

    }
}
