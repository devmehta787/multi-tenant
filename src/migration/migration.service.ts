import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { clerkClient } from '../config/clerk.config';

@Injectable()
export class MigrationService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async migrateUsers() {
    const admins = await this.adminRepository.find();

    for (const admin of admins) {
      try {
        const existingUsers = await clerkClient.users.getUserList({
          emailAddress: [admin.email],
        });

        if (existingUsers.data.length > 0) {
          console.log(`User already exists: ${admin.email}`);
          continue; 
        }

        let formattedPhoneNumber = null;
        if (admin.phone) {
          formattedPhoneNumber = this.formatPhoneNumber(admin.phone);
        }

        const userPayload: any = {
          emailAddress: [admin.email],
          username: admin.user_name,
          password: admin.password,
          firstName: admin.first_name,
          lastName: admin.last_name,
          publicMetadata: {
            company: admin.company,
            type: admin.type,
          },
        };

        if (formattedPhoneNumber) {
          userPayload.phoneNumber = [formattedPhoneNumber];
        }

        await clerkClient.users.createUser(userPayload);
        console.log(`Migrated user: ${admin.email}`);
      } catch (error) {
        console.error(`Failed to migrate user ${admin.email}:`, error);
      }
    }
  }

  private formatPhoneNumber(phone: string): string | null {
    if (!phone.startsWith('+91')) {
      phone = `+91${phone}`;
    }

    const phoneRegex = /^\+91\d{10}$/;
    return phoneRegex.test(phone) ? phone : null;
  }
}
