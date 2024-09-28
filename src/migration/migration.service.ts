import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { clerkClient } from '../config/clerk.config'
@Injectable()
export class MigrationService {
    constructor(
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>,
    ) { }
    async migrateUsers() {
        const admins = await this.adminRepository.find();
        console.log(process.env.CLERK_API_KEY);
        for (const admin of admins) {
            try {
                await clerkClient.users.createUser({
                    emailAddress: [admin.email],
                    username: admin.user_name,
                    password: admin.password, // Ensure passwords are securely handled
                    firstName: admin.first_name,
                    lastName: admin.last_name,
                    phoneNumber: admin.phone ? [admin.phone] : [],
                    publicMetadata: {
                        company: admin.company,
                        type: admin.type,
                    },
                });
                console.log(`Migrated user: ${admin.email}`);
            } catch (error) {
                console.error(`Failed to migrate user ${admin.email}:`, error);
            }
        }
    }
}