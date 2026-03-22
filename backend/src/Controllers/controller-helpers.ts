import {
  applyDecorators,
  BadRequestException,
  type Type,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { QueryPageResult } from '../Application/QueryPageResult';
import { ExtendedParameters } from '../Models/ExtendedParameters';

function parsePositiveInteger(
  value: string | number | undefined,
  fieldName: string,
): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new BadRequestException(`${fieldName} must be a positive integer.`);
  }

  return parsed;
}

export function createExtendedParameters(
  pageNumber?: string,
  pageSize?: string,
): ExtendedParameters {
  const params = new ExtendedParameters();
  const parsedPageNumber = parsePositiveInteger(pageNumber, 'pageNumber');
  const parsedPageSize = parsePositiveInteger(pageSize, 'pageSize');

  if (parsedPageNumber !== undefined) {
    params.pageNumber = parsedPageNumber;
  }

  if (parsedPageSize !== undefined) {
    params.pageSize = parsedPageSize;
  }

  return params;
}

export function requirePositiveInteger(
  value: string | number | undefined,
  fieldName: string,
): number {
  const parsed = parsePositiveInteger(value, fieldName);

  if (parsed === undefined) {
    throw new BadRequestException(`${fieldName} is required.`);
  }

  return parsed;
}

export function ApiPaginatedResponse(model: Type<unknown>) {
  return applyDecorators(
    ApiExtraModels(QueryPageResult, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(QueryPageResult) },
          {
            properties: {
              response: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
}
