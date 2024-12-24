import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: 'http://localhost:4200',
		credentials: true,
	});

	app.use(cookieParser());

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			stopAtFirstError: true,
			forbidUnknownValues: true,
			validateCustomDecorators: true,
			whitelist: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle('Nest.js Template API')
		.setDescription('The Nest.js template API description')
		.setVersion('1.0')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, documentFactory);

	await app.listen(3000);
}
bootstrap();
