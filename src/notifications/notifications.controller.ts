import { Controller, Get, Put, Param, Query, HttpCode } from '@nestjs/common';
import { NotificationService } from './notifications.service.js';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('notifications')
  getNotifications(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.notificationService.getNotifications(
      Number(page) || 1,
      Number(limit) || 10,
      unreadOnly === 'true',
    );
  }

  @Put('notifications/:notificationId/read')
  @HttpCode(204)
  markNotificationRead(@Param('notificationId') notificationId: string) {
    return this.notificationService.markNotificationRead(notificationId);
  }
}
