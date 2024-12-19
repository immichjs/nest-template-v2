import { Controller, Headers, Inject, MessageEvent, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
	@Inject() private readonly notificationService: NotificationService;

	@Sse('listener')
	public listener(@Headers() headers: any): Observable<MessageEvent> {
		return this.notificationService.listener$();
	}
}
