import { Controller, Get } from "@nestjs/common";
import { MysqlService } from "./mysql.service";

@Controller("mysql")
export class MysqlController{
    constructor(private readonly mysqlService: MysqlService){}

}