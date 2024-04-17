import { Controller, Post, Body } from "@nestjs/common";
import { MysqlService } from "src/mysql/mysql.service";
import { PostgresService } from "src/postgres/postgres.service";
import { SnowflakeService } from "src/snowflake/snowflake.service";
import { PreviewService } from "./preview.service";
import { PreviewDto } from "src/preview/dto/preview.dto";


@Controller("preview")
export class PreviewController {
    constructor(
        private  postgresService: PostgresService,
        private  mysqlService: MysqlService,
        private  snowflakeService: SnowflakeService,
        private previewService: PreviewService,

    ) {}

    @Post()
    async previewData(@Body() previewDto:PreviewDto[]): Promise<any[]> {
        return this.previewService.previewData(previewDto);
        
    }
}
