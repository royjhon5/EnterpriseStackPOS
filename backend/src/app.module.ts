import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import jwtConfig from './Configurations/Registrar/jwt.config';
import { AuthModule } from './Configurations/Registrar/JwtRegistrar';
import { validateEnvironment } from './Configurations/Registrar/env.validation';
import { DbConnection } from './Settings/DbConnection';
import { DbContext } from './Domain/DatabaseContext/DbContext';
import { ControllerContainer } from './Controllers/ControllerContainer';
import { HandlerProvider } from './Application/Provider/HandlerProvider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
      validate: validateEnvironment,
    }),
    AuthModule,
    CqrsModule,
    TypeOrmModule.forRoot(DbConnection()),
    TypeOrmModule.forFeature(DbContext),
  ],
  //Note: ControllerContainer is very important because it will hold all of the controller
  controllers: ControllerContainer,
  providers: HandlerProvider,
})
export class AppModule {}
