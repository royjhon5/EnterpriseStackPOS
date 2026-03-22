// src/Common/Http/result-helper.ts
import { Response } from 'express';

type HttpResultShape = {
  statusCode: number;
};

export function toHttpResult<T extends HttpResultShape>(
  res: Response,
  result: T,
): T {
  res.status(result.statusCode);
  return result;
}
