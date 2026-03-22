// src/Services/Validations/validator-to-validationerror.ts
import { HttpStatus } from '@nestjs/common';
import { ValidationError } from '../../../Constants/ValidationError';
import { Validator } from '../../../Services/Validations/Props/Validations';

export function toValidationError(
  validator: Validator,
  statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
): ValidationError {
  const err = new ValidationError(statusCode);

  // attach your validator payload so your frontend can read it
  // (ErrorResponse probably supports "payload", if not, it's still fine in JS runtime)
  (err as any).payload = validator.asValidationError().payload;

  // optional: create a single readable message
  err.message = validator.extractErrorMessageFromPayload(
    validator.asValidationError(),
  );

  return err;
}
