//app.module.ts

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { EngineService } from './engine.service';
import { EngineController } from './engine.controller';

@Module({
  imports: [],
  controllers: [EngineController],
  providers: [
    EngineService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
