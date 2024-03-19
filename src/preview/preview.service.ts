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

    
    async previewData(previewDto: PreviewDto): Promise<any> {
        const { engine, database, table,schema } = previewDto;
        try {
            let data;
            switch (engine) {
                case "postgres":
                    console.log("entered postgresssss->",database,table)
                    try{
                        data= await this.postgresService.executeQuery(database,table);
                        return {"engine":engine,"data":data};
                    }
                    catch(error){
                        return {message: `Failed to fetch data from postgres: ${error.message}`}
                    }
                    break;

                case "mysql":
                    console.log("entered mysqllll",database,table)

                    try {
                        data=await this.mysqlService.executeQuery(database,table);
                        return data;
                        
                    } catch (error) {
                        return {message: `Failed to fetch data from Mysql: ${error.message}`}
                        
                    }
                    break;

                case "snowflake":
                    console.log("entered snowflakeee",database,table)

                    try {
                        data = await this.snowflakeService.executeQuery(database,schema,table);
                        return {"engine":engine,"data":data};
                    } 
                    catch (error) {
                        return{message: `Failed to fetch data: ${error.message}`}
                    }

                    break;

                default:
                    throw new Error(`Unsupported engine type: ${engine}`);
            }

            return data;

        } 
        
        catch (error) {
            return { message: `Failed to fetch data: ${error.message}` };
        }

    }
}
