import { Controller, Get } from '@nestjs/common';
import { MigrationService } from './migration/migration.service';

@Controller('migration')
export class AppController {
  constructor(private readonly migrationService: MigrationService) {}

  @Get()
  async migrateUsers() {
    await this.migrationService.migrateUsers();
    return { message: 'Migration completed' };
  }
}
