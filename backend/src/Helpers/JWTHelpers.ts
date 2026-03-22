// src/common/helpers/jwt-helpers.ts
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

export class JwtHelpers {
  /**
   * Decode token WITHOUT verifying signature (matches your C# ReadToken behavior).
   * If you want verified token, use JwtService.verify() instead.
   */
  private static decodeBearerToken(
    req: Request,
    jwtService?: JwtService,
  ): Record<string, any> {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token not found!');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header format!');
    }

    // If JwtService is provided, use it; otherwise just decode (no verification).
    const decoded = jwtService ? jwtService.decode(token) : undefined;

    // Fallback decode without JwtService (pure base64 decode via jwtService is preferred)
    if (!decoded) {
      // minimal decode fallback if you really don't have JwtService here:
      const parts = token.split('.');
      if (parts.length < 2)
        throw new UnauthorizedException('Invalid JWT token!');
      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64').toString('utf8'),
      );
      return payload;
    }

    if (typeof decoded === 'string' || decoded == null) {
      throw new UnauthorizedException('JWT payload not found!');
    }

    return decoded as Record<string, any>;
  }

  static getClaimByType(
    req: Request,
    type: string,
    jwtService?: JwtService,
  ): string | null {
    const payload = this.decodeBearerToken(req, jwtService);

    const value = payload?.[type];
    if (value === undefined || value === null) return null;

    return String(value);
  }

  static getUserIdFromToken(
    req: Request,
    jwtService?: JwtService,
  ): string | null {
    return this.getClaimByType(req, 'userId', jwtService);
  }

  static getProfileIdFromToken(req: Request, jwtService?: JwtService): number {
    const val = this.getClaimByType(req, 'profileId', jwtService);
    if (!val) throw new BadRequestException('profileId claim not found!');
    const n = Number(val);
    if (Number.isNaN(n))
      throw new BadRequestException('Invalid profileId format in token!');
    return n;
  }

  // NOTE: Your C# name says "...FromHeader" but it actually reads it from token.
  static getTenantIdFromToken(req: Request, jwtService?: JwtService): number {
    const val = this.getClaimByType(req, 'tenantId', jwtService);
    if (!val) throw new BadRequestException('tenantId claim not found!');
    const n = Number(val);
    if (Number.isNaN(n))
      throw new BadRequestException('Invalid tenantId format in token!');
    return n;
  }

  static getTenantIdFromHeaders(req: Request): number {
    const tenantHeader = req.headers['tenantid']; // header keys are lowercased in express

    const raw = Array.isArray(tenantHeader) ? tenantHeader[0] : tenantHeader;

    if (!raw) throw new BadRequestException('tenantId header not found!');

    const tenantId = Number(raw);
    if (Number.isNaN(tenantId)) {
      throw new BadRequestException('Invalid tenantId format in header!');
    }

    return tenantId;
  }
}
