import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './migration/admin.entity';
import { MigrationModule } from './migration/migration.module';
import { AppController } from './app.controller';
import { MigrationService } from './migration/migration.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MySQL_HOST || 'localhost',
      port: +process.env.MYSQL_PORT || 3306,
      username: process.env.MYSQL_USERNAME || 'root',
      password: process.env.MYSQL_PASSWORD || 'password',
      database: process.env.MYSQL_DB || 'admin_db',
      entities: [Admin],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Admin]),
  ],
  controllers: [AppController],
  providers: [MigrationService],
})
export class AppModule {}
