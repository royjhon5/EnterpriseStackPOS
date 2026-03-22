import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../../Services/AuthService/IAuthService';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwtToken(userId: string, roleType: string, tenantId: number): string {
    return this.jwtService.sign({
      userId,
      roleType,
      tenantId,
    });
  }
}
