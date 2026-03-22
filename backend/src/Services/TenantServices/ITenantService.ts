export interface ITenantService {
  /** Current tenant ID */
  currentTenantId: number;

  /** Sets the tenant based on the host */
  setTenantAsync(host: string): Promise<void>;
}
