import { NotificationRepositoryContract } from '@domain/contracts/notification.repository.contract';
import { CreateNotificationDTO } from '@domain/dtos/create-notification.dto';
import { Notification } from '@domain/entities/notification';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class NotificationRepository extends NotificationRepositoryContract {
	@InjectRepository(Notification)
	private readonly notificationRepository: Repository<Notification>;

	public async create(data: CreateNotificationDTO): Promise<Notification> {
		const notification = this.notificationRepository.create(data);

		return this.notificationRepository.save(notification);
	}

	public async find(filters: Partial<Notification>): Promise<Notification[]> {
		const notifications = await this.notificationRepository.find({
			where: filters,
		});

		return notifications;
	}

	public async findOne(filters: Partial<Notification>): Promise<Notification> {
		const notification = await this.notificationRepository.findOne({
			where: filters,
		});

		return notification;
	}
}
