// src/config/registrars/app-settings.registrar.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IRegistrar } from '../../Configurations/IRegistrar';

@Injectable()
export class AppSettingsRegistrar implements IRegistrar {
  constructor(private configService: ConfigService) {}

  register() {
    this.configService.get<string>('jwt.secret');
  }
}
