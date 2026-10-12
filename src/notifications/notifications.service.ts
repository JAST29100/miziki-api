import { Injectable, NotFoundException } from "@nestjs/common";

export interface Notification{
  id: string;
  userId: string,
  message: string;
  read: boolean;
}
@Injectable()
  export class NotificationService{
    private notifications: Array<Notification> = [
      { id: '1', userId: '1', message: 'Tienes un nuevo match', read: false },
      { id: '2', userId: '1', message: 'Evento cerca de ti', read: false },
      { id: '3', userId: '1', message: 'Asistencia confirmada', read: false },
    ];
  getNotifications(
    page: number = 1,
    limit: number = 10,
    unreadOnly: boolean = false,
  ): Array<Notification> {
    let result = this.notifications;
    if (unreadOnly) {
      result = result.filter((n) => n.read === false)
    }
    const start = (page - 1) * limit;
    return result.slice(start, start + limit);
  }
  markNotificationRead(notificationId: string): void {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification === undefined) {
      throw new NotFoundException('Notificacion no encontrada');
    }
    notification.read = true;
  }
}
