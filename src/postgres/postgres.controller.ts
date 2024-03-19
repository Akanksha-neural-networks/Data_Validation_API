import { Controller, Get } from "@nestjs/common";
import { PostgresService } from "./postgres.service";


@Controller("postgres")
export class PostgresController{
    constructor(private postgresService: PostgresService){}

}