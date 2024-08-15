import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { EmailService } from '../email/service';
import { BackupEmailService } from '../backup/email/backup.email.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()], // Import ScheduleModule
  providers: [NotificationService, EmailService, BackupEmailService],
  controllers: [NotificationController],
})
export class NotificationModule {}
