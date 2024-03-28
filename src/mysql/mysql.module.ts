import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { default as MysqlConfig } from 'src/config/engine-mysql.config';
import { MysqlService } from './mysql.service';
import { MysqlController } from './mysql.controller';

@Module({
  imports: [ConfigModule],

  controllers: [MysqlController],
  providers: [MysqlService],
  exports: [MysqlService],
})
export class Mysqlmodule {}
