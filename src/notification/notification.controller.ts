import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('email')
  @ApiOperation({ summary: 'Send email notification' })
  @ApiResponse({ status: 201, description: 'Email sent successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ 
    schema: { 
      example: { 
        to: '', 
        subject: 'Hello', 
        body: 'World', 
        urgency: 'high',
        userActivity: 'active'
      }
    }
  })
  async sendEmailNotification(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('body') body: string,
    @Body('urgency') urgency: 'high' | 'medium' | 'low',
    @Body('userActivity') userActivity: 'active' | 'inactive',
  ) {
    return this.notificationService.notifyUser(to, subject, body, urgency, userActivity);
  }
}
