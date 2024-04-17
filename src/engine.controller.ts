import { Controller, Get } from '@nestjs/common';
import { EngineService } from './engine.service';

@Controller()
export class EngineController {
  constructor(private readonly engineService: EngineService) {}

  @Get('/engine-names')
  getAllEngineNames() {
    return this.engineService.getAllEngineNames();
  }
}
