import { ApiResult } from '@/types/result';

export function normalizeResult<T>(result: ApiResult<T>): ApiResult<T> {
    const validatorError = result.validatorError && Object.keys(result.validatorError).length === 0 ? null : result.validatorError;
    return {
        ...result,
        validatorError,
        isSuccess: typeof result.isSuccess === 'boolean' ? result.isSuccess : !validatorError,
    };
}
export function unwrapResult<T>(result: ApiResult<T>): T {
    const normalized = normalizeResult(result);
    if (!normalized.isSuccess || normalized.validatorError?.message) {
        throw new Error(normalized.validatorError?.message || 'Request failed');
    }
    return normalized.response as T;
}
