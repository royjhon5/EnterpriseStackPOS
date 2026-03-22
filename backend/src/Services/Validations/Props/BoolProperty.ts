import { Property } from '../../../Services/Validations/Props/Property';

export class BoolProperty extends Property {
  protected value: boolean | null;

  constructor(val: boolean | null, name: string, required: boolean) {
    super(name, required);

    this.value = val;
    this.isNull = val === null;

    this.prepare();
  }

  true(): this {
    if (!this.validate) return this;

    if (this.value !== null && this.value !== true) {
      this.errors.push('Must be true');
    }

    return this;
  }

  false(): this {
    if (!this.validate) return this;

    if (this.value !== null && this.value !== false) {
      this.errors.push('Must be false');
    }

    return this;
  }
}
