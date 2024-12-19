import { NotificationRepositoryContract } from '@domain/contracts/notification.repository.contract';
import { CreateNotificationDto } from '@domain/dtos/create-notification.dto';
import { Notification } from '@domain/entities/notification';
import { Inject, Injectable } from '@nestjs/common';
import { map, Observable, Subject } from 'rxjs';

@Injectable()
export class NotificationService {
	@Inject(NotificationRepositoryContract)
	private readonly notificationRepository: NotificationRepositoryContract;

	private readonly subject = new Subject<Notification>();

	public listener$(): Observable<any> {
		return this.subject
			.asObservable()
			.pipe(map((notification: Notification) => JSON.stringify(notification)));
	}

	public async create(data: CreateNotificationDto): Promise<Notification> {
		const notification = await this.notificationRepository.create(data);

		if (notification) {
			this.subject.next(notification);
		}

		return notification;
	}

	public async find(filters: Partial<Notification>): Promise<Notification[]> {
		return this.notificationRepository.find(filters);
	}

	public async findOne(filters: Partial<Notification>): Promise<Notification> {
		return this.notificationRepository.findOne(filters);
	}
}
