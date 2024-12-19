import { Controller, Headers, Inject, MessageEvent, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
	@Inject() private readonly notificationService: NotificationService;

	@Sse('listener')
	public listener(@Headers() headers: any): Observable<MessageEvent> {
		return this.notificationService.listener$();
	}
}
