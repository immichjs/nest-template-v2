import { Notification } from '@domain/entities/notification';

export abstract class NotificationRepositoryContract {
	abstract create(data: any): Promise<Notification>;
	abstract find(filters: Partial<Notification>): Promise<Notification[]>;
	abstract findOne(filters: Partial<Notification>): Promise<Notification>;
}
