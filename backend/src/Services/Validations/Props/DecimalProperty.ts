import { Property } from '../../../Services/Validations/Props/Property';

export class DecimalProperty extends Property {
  protected value: number | null;

  constructor(val: number | null, name: string, required: boolean) {
    super(name, required);

    this.value = val;
    this.isNull = val === null;

    this.prepare();
  }

  min(min: number): this {
    if (!this.validate) return this;

    if (this.value !== null && this.value < min) {
      this.errors.push(`Must be ${min} or above`);
    }

    return this;
  }

  max(max: number): this {
    if (!this.validate) return this;

    if (this.value !== null && this.value > max) {
      this.errors.push(`Must be ${max} or below`);
    }

    return this;
  }
}
