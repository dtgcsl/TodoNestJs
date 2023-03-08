import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  schema: process.env.DATABASE_SCHEMA,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  entities: [
    'C:/Users/Giang/Desktop/Todo - TypeORM - Copy/src/entity/*.entity.ts',
  ],
  // DATABASE_TYPE='postgres'
  // DATABASE_HOST='localhost'
  // DATABASE_PORT=5432
  // DATABASE_USERNAME='postgres'
  // DATABASE_PASSWORD='1'
  // DATABASE_DATABASE='postgres'
  // DATABASE_ENTITIES= []
  // DATABASE_SCHEMA='Todo'
  // DATABASE_SYNCHRONIZE='false'
}));
