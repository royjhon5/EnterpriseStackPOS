export function isString(type: unknown): boolean {
  return type === String;
}

export function isInteger(type: unknown): boolean {
  return type === Number;
}

export function isBoolean(type: unknown): boolean {
  return type === Boolean;
}

export function isDouble(type: unknown): boolean {
  return type === Number;
}

export function isDate(type: unknown): boolean {
  return type === Date;
}

export function isMarkedAsNullable(value: unknown): boolean {
  return value === null || value === undefined;
}
