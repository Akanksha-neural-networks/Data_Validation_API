import { Body, Controller, Post } from '@nestjs/common';
import { CountService } from './count.service';
import { CountDto } from './dto/count.dto';
import { MysqlService } from "src/mysql/mysql.service";
import { PostgresService } from "src/postgres/postgres.service";
import { SnowflakeService } from "src/snowflake/snowflake.service";

@Controller('count')
export class CountController {
    constructor(
        private countService: CountService, 
        
        ){}

    @Post()
    async countData(@Body() countDto: CountDto[]): Promise<any[]>{
        return await this.countService.countData(countDto);

    }
}
