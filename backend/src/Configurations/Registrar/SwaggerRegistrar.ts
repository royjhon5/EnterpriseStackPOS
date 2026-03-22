import { DocumentBuilder } from '@nestjs/swagger';

export function SwaggerRegistrar() {
  return new DocumentBuilder()
    .setTitle('Enterprise POS API v.1')
    .setDescription(
      'This API is designed for a scalable, enterprise-grade, multi-branch POS system suitable for SaaS and LGU/commercial use',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        description: 'JWT Authorization header using the bearer scheme',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();
}
