// src/common-columns.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { CommonColumnsService } from './common-columns.service';
import { CommonColumnsDto } from './dto/common-columns.dto';

@Controller('common-columns')
export class CommonColumnsController {
  constructor(private readonly commonColumnsService: CommonColumnsService) {}

  @Post()
  async getCommonColumns(@Body() data: CommonColumnsDto[]): Promise<any> {
    return this.commonColumnsService.getColumns(data);
  }
}

