import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { EmailService } from '../email/service';
import { BackupEmailService } from '../backup/email/backup.email.service';

@Module({
  providers: [NotificationService, EmailService, BackupEmailService],
  controllers: [NotificationController],
})
export class NotificationModule {}
