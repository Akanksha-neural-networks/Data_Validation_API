import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class EngineService {
  private readonly engineData: { name: string }[];

  constructor() {
    try {
      const fileContent = fs.readFileSync('./src/engine.json', 'utf8');
      const jsonData = JSON.parse(fileContent);
      this.engineData = jsonData.engines || [];
    } catch (error) {
      console.error('Error reading or parsing engine.json:', error);
      this.engineData = [];
    }
  }

  getAllEngineNames() {
    return this.engineData.map((engine) => engine.name);
  }
}
