export interface ApiValidationError {
    statusCode?: number;
    title?: string;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface ApiResult<T> {
    response?: T;
    statusCode: number;
    validatorError?: ApiValidationError | null;
    isSuccess?: boolean;
}

export interface ApiPageDetails {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

export interface ApiPageResult<T> extends ApiResult<T> {
    pageDetails?: ApiPageDetails;
}
