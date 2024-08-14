import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/service';
import { BackupEmailService } from '../backup/email/backup.email.service';

@Injectable()
export class NotificationService {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(
    private readonly emailService: EmailService,
    private readonly backupEmailService: BackupEmailService,
  ) {}

  async sendNotification(to: string, subject: string, body: string) {
    try {
      await this.emailService.sendEmail(to, subject, body);
      console.log('Email sent successfully');
    } catch (error) {
      this.retryCount++;
      console.error(`Failed to send email. Attempt ${this.retryCount}`);

      if (this.retryCount < this.maxRetries) {
        await this.sendNotification(to, subject, body);
      } else {
        console.log('Switching to backup email service');
        await this.backupEmailService.sendEmail(to, subject, body);
      }
    }
  }
}
