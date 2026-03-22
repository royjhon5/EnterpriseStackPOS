import { Property } from '../../../Services/Validations/Props/Property';

export class DateTimeProperty extends Property {
  protected value: Date | null;

  constructor(val: Date | null, name: string, required: boolean) {
    super(name, required);

    this.value = val;
    this.isNull = val === null;

    this.prepare();
  }

  range(min: Date, max: Date): this {
    return this.min(min).max(max);
  }

  min(min: Date): this {
    if (!this.validate) return this;

    if (this.value !== null && this.value < min) {
      this.errors.push(`Must be ${min.toISOString()} or above`);
    }

    return this;
  }

  max(max: Date): this {
    if (!this.validate) return this;

    if (this.value !== null && this.value > max) {
      this.errors.push(`Must be ${max.toISOString()} or below`);
    }

    return this;
  }
}
