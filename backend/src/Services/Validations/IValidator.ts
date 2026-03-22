import { BoolProperty } from '../../Services/Validations/Props/BoolProperty';
import { DateTimeOffsetProperty } from '../../Services/Validations/Props/DateTimeOffsetProperty';
import { DateTimeProperty } from '../../Services/Validations/Props/DateTimeProperty';
import { DecimalProperty } from '../../Services/Validations/Props/DecimalProperty';
import { DoubleProperty } from '../../Services/Validations/Props/DoubleProperty';
import { IntProperty } from '../../Services/Validations/Props/IntProperty';
import { ObjectProperty } from '../../Services/Validations/Props/ObjectProperty';
import { Property } from '../../Services/Validations/Props/Property';
import { Result } from '../../Services/Validations/Props/Result';
import { StringProperty } from '../../Services/Validations/Props/StringProperty';
import { TimeSpanProperty } from '../../Services/Validations/Props/TimeSpanProperty';

export interface ValidationError {
  payload: Result[];
}

export interface IValidator {
  isObject(val: unknown, name: string, required?: boolean): ObjectProperty;
  isString(
    val: string | null,
    name: string,
    required?: boolean,
  ): StringProperty;
  isNumber(
    val: number | null,
    name: string,
    required?: boolean,
  ): IntProperty | DoubleProperty;
  isBool(val: boolean | null, name: string, required?: boolean): BoolProperty;
  isDateTime(
    val: Date | null,
    name: string,
    required?: boolean,
  ): DateTimeProperty;
  isDateTimeOffset(
    val: Date | null,
    name: string,
    required?: boolean,
  ): DateTimeOffsetProperty;
  isDecimal(
    val: number | null,
    name: string,
    required?: boolean,
  ): DecimalProperty;
  isTimeSpan(
    val: number | null,
    name: string,
    required?: boolean,
  ): TimeSpanProperty;
  isFailed(name: string, message: string, required?: boolean): Property;

  validate(): boolean;
  containsError(): boolean;
  asValidationError(): ValidationError;
  extractErrorMessageFromPayload(validationError: ValidationError): string;
}

export class Validator implements IValidator {
  private validations: Property[] = [];
  public errors: Result[] = [];

  /** Type validations */

  isObject(val: unknown, name: string, required = false): ObjectProperty {
    const validation = new ObjectProperty(val, name, required);
    this.validations.push(validation);
    return validation;
  }

  isString(val: string | null, name: string, required = false): StringProperty {
    const validation = new StringProperty(val, name, required);
    this.validations.push(validation);
    return validation;
  }

  isNumber(
    val: number | null,
    name: string,
    required = false,
  ): IntProperty | DoubleProperty {
    const validation = Number.isInteger(val)
      ? new IntProperty(val, name, required)
      : new DoubleProperty(val, name, required);

    if (val !== null && val <= 0)
      validation.addError(`${name} must be greater than 0.`);

    this.validations.push(validation);
    return validation;
  }

  isBool(val: boolean | null, name: string, required = false): BoolProperty {
    const validation = new BoolProperty(val, name, required);
    this.validations.push(validation);
    return validation;
  }

  isDateTime(
    val: Date | null,
    name: string,
    required = false,
  ): DateTimeProperty {
    const validation = new DateTimeProperty(val, name, required);
    this.validations.push(validation);
    return validation;
  }

  isDateTimeOffset(
    val: Date | null,
    name: string,
    required = false,
  ): DateTimeOffsetProperty {
    const validation = new DateTimeOffsetProperty(val, name, required);
    this.validations.push(validation);
    return validation;
  }

  isDecimal(
    val: number | null,
    name: string,
    required = false,
  ): DecimalProperty {
    const validation = new DecimalProperty(val, name, required);
    this.validations.push(validation);
    return validation;
  }

  isTimeSpan(
    val: number | null,
    name: string,
    required = false,
  ): TimeSpanProperty {
    const validation = new TimeSpanProperty(val, name, required);
    this.validations.push(validation);
    return validation;
  }

  isFailed(name: string, message: string, required = true): Property {
    const validation = new Property(name, required);
    validation.addError(message);
    this.validations.push(validation);
    return validation;
  }

  /** Utils */

  validate(): boolean {
    const mapped = this.validations.map((v) => v.results());
    this.errors = mapped.filter((v) => v.errors.length > 0);
    return this.errors.length === 0;
  }

  containsError(): boolean {
    return !this.validate();
  }

  asValidationError(): ValidationError {
    return { payload: this.errors };
  }

  extractErrorMessageFromPayload(validationError: ValidationError): string {
    if (!validationError?.payload) return 'No payload to process.';

    const messages: string[] = [];

    for (const fieldError of validationError.payload) {
      const { name, errors } = fieldError;
      if (name && errors) {
        errors.forEach((err) => messages.push(`${name}: ${err}`));
      }
    }

    return messages.join('; ');
  }
}
