import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/service';
import { BackupEmailService } from '../backup/email/backup.email.service';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  private retryCount = 0;
  private maxRetries = 3;
  URGENCY_HIGH = 'high';
  URGENCY_MEDIUM = 'medium';
  URGENCY_LOW = 'low';
  ACTIVE_STATUS = 'active';

  constructor(
    private readonly emailService: EmailService,
    private readonly backupEmailService: BackupEmailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async notifyUser(to: string, subject: string, body: string, urgency: string, userActivity: string) {
    const delay = this.calculateDelay(urgency , userActivity);
    try {
    if(delay === -1){
        console.log("please cross check fields URGENCY and USER_ACTIVITY");
    }
    else if (delay === 0) {
      const response = await this.emailService.sendEmail(to, subject, body );
      console.log("Email send successfully");
    } else {
      console.log('Email sent automatically after '+ delay + 'ms');
      this.scheduleEmail(to, subject, body, delay);

    }
  } catch (error) {
    this.retryCount++;
    console.error(`Failed to send email. Attempt ${this.retryCount}`);

    if (this.retryCount < this.maxRetries) {
      await this.notifyUser(to, subject, body, urgency,userActivity);
    } else {
      console.log('Switching to backup email service');
      try{
        await this.backupEmailService.sendEmail(to, subject, body);
      }
      catch(error){
        console.error("backup service failed");
      }
    }
  }
  }
 
  private calculateDelay(
    urgency: string,
    userActivity: string,
  ): number {
   
    if (urgency == this.URGENCY_HIGH ) {
      return userActivity == this.ACTIVE_STATUS ? 0 : 30 * 60 * 1000; // 30 minutes
    } else if (urgency == this.URGENCY_MEDIUM) {
      return 60 * 60 * 1000; // 1 hour
    } else if (urgency == this.URGENCY_LOW) {
      return 2 * 60 * 60 * 1000; // 2 hours
    }
    return -1;
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

}
