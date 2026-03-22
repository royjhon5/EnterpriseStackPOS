export function unwrapResult<T extends { statusCode: number; validatorError?: { message?: string } }>(result: T) {
    if (result.validatorError?.message) {
        throw new Error(result.validatorError.message);
    }
    return result;
}
