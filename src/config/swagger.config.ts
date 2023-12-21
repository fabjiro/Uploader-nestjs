import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Uploader Api')
    .setDescription('Documentacion de la api Uploader')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Project')
    .addTag('File')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
