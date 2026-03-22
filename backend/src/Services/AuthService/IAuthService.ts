export interface IAuthService {
  generateJwtToken(userId: string, roleType: string, tenantId: number): string;
}
