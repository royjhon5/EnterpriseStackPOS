export type AuthSession = {
    token: string;
    tenantId: number;
    userId: string;
    fullName: string;
    email?: string;
    roleType?: string;
    phoneNumber?: string;
};

export type BackendLoginResponse = {
    TenantId: number;
    UserId: string;
    Token: string;
    FullName: string;
    Email?: string;
    RoleType?: string;
    phoneNumber?: string;
};
