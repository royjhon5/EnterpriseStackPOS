import { Property } from '../../../Services/Validations/Props/Property';

export class TimeSpanProperty extends Property {
  /** Value in milliseconds */
  protected value: number | null;

  constructor(val: number | null, name: string, required: boolean) {
    super(name, required);

    this.value = val;
    this.isNull = val === null;

    this.prepare();
  }

  range(min: number, max: number): this {
    return this.min(min).max(max);
  }

  min(min: number): this {
    if (!this.validate) return this;

    if (this.value !== null && this.value < min) {
      this.errors.push(`Must be ${min}ms or above`);
    }

    return this;
  }

  max(max: number): this {
    if (!this.validate) return this;

    if (this.value !== null && this.value > max) {
      this.errors.push(`Must be ${max}ms or below`);
    }

    return this;
  }
}
