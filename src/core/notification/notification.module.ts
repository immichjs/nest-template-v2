import { NotificationRepositoryContract } from '@domain/contracts/notification.repository.contract';
import { Notification } from '@domain/entities/notification';
import { NotificationRepository } from '@infra/persistence/notification.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
	imports: [TypeOrmModule.forFeature([Notification])],
	controllers: [NotificationController],
	providers: [
		{
			provide: NotificationRepositoryContract,
			useClass: NotificationRepository,
		},
		NotificationService,
	],
	exports: [NotificationService],
})
export class NotificationModule {}
