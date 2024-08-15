import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/service';
import { BackupEmailService } from '../backup/email/backup.email.service';
import { SchedulerRegistry } from '@nestjs/schedule';


@Injectable()
export class NotificationService {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(
    private readonly emailService: EmailService,
    private readonly backupEmailService: BackupEmailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async notifyUser(to: string, subject: string, body: string, urgency: 'high' | 'medium' | 'low', userActivity: 'active' | 'inactive',
  ) {
    const delay = this.calculateDelay(urgency, userActivity);
    try {
    if (delay === 0) {
      await this.emailService.sendEmail(to, subject, body );
      console.log('Email sent successfully');
    } else {
      console.log('Email sent automatically after'+ delay);
      this.scheduleEmail(to, subject, body, delay);

    }
  } catch (error) {
    this.retryCount++;
    console.error(`Failed to send email. Attempt ${this.retryCount}`);

    if (this.retryCount < this.maxRetries) {
      await this.emailService.sendEmail(to, subject, body);
    } else {
      console.log('Switching to backup email service');
      await this.backupEmailService.sendEmail(to, subject, body);
    }
  }
  }

  private calculateDelay(
    urgency: 'high' | 'medium' | 'low',
    userActivity: 'active' | 'inactive',
  ): number {
    if (urgency === 'high') {
      return userActivity === 'active' ? 0 : 30 * 60 * 1000; // 30 minutes
    } else if (urgency === 'medium') {
      return 60 * 60 * 1000; // 1 hour
    } else if (urgency === 'low') {
      return 2 * 60 * 60 * 1000; // 2 hours
    }
    return 0;
  }

  private scheduleEmail(
    to: string,
    subject: string,
    body: string,
    delay: number,
  ) {
    const timeoutId = setTimeout(async () => {
      await this.emailService.sendEmail( to, subject, body );
    }, delay);

    this.schedulerRegistry.addTimeout(`${to}-${subject}`, timeoutId);
  }


  // async sendNotification(to: string, subject: string, body: string) {
  //   try {
  //     await this.emailService.sendEmail(to, subject, body);
  //     console.log('Email sent successfully');
  //   } catch (error) {
  //     this.retryCount++;
  //     console.error(`Failed to send email. Attempt ${this.retryCount}`);

  //     if (this.retryCount < this.maxRetries) {
  //       await this.sendNotification(to, subject, body);
  //     } else {
  //       console.log('Switching to backup email service');
  //       await this.backupEmailService.sendEmail(to, subject, body);
  //     }
  //   }
  // }
}
