import { Injectable } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class PostgresService {
  private client: Client;

  constructor() {
    this.client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'college',
      password: 'omsairam',
      port: 5432,
    });
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('Successfully connected to PostgreSQL.');
    } catch (err) {
      console.error('Error connecting to PostgreSQL:', err);
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.end();
      console.log('Disconnected from PostgreSQL.');
    } catch (err) {
      console.error('Error disconnecting from PostgreSQL:', err.message);
    }
  }

  async executeQuery(query: string): Promise<any[]> {
    try {
      const { rows } = await this.client.query(query);
      return rows;
    } catch (err) {
      console.error('Error executing query in PostgreSQL:', err);
      throw err;
    }
  }
}
