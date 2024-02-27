import { Controller, Get } from "@nestjs/common";
import {SnowflakeService} from './snowflake.service'

@Controller("dataValidation")
export class SnowflakeController {

    constructor(private readonly snowflakeService: SnowflakeService) {}   
  
    @Get('/data')
    async fetchData() {
      try {

        await this.snowflakeService.connect();

        const data = await this.snowflakeService.executeQuery('SELECT * FROM VEGETABLE_DEPTH');
        return data;

      } catch (error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
      }
    }
  }

