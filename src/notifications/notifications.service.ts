import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { NotificationRecord } from './notification.schema.js';
import type { NotificationDocument } from './notification.schema.js';

export interface Notification { id: string; userId: string; message: string; read: boolean; }

@Injectable()
export class NotificationService {
  constructor(@InjectModel(NotificationRecord.name) private readonly notificationModel: Model<NotificationDocument>) {}
  private format(notification: NotificationDocument): Notification {
    return { id: notification._id.toString(), userId: notification.userId, message: notification.message, read: notification.read };
  }
  async getNotifications(page = 1, limit = 10, unreadOnly = false): Promise<Notification[]> {
    const query = unreadOnly ? { read: false } : {};
    const notifications = await this.notificationModel.find(query).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
    return notifications.map(notification => this.format(notification));
  }
  async markNotificationRead(notificationId: string): Promise<void> {
    const notification = /^[a-f\d]{24}$/i.test(notificationId)
      ? await this.notificationModel.findByIdAndUpdate(notificationId, { read: true })
      : null;
    if (!notification) throw new NotFoundException('Notificacion no encontrada');
  }
}
