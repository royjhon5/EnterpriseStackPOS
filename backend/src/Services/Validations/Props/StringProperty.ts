import { Property } from '../../../Services/Validations/Props/Property';

export class StringProperty extends Property {
  protected value: string | null;

  constructor(val: string | null, name: string, required: boolean) {
    super(name, required);

    this.value = val;
    this.isNull = !val || val.trim() === '';

    this.prepare();
  }

  isEmail(): this {
    if (!this.validate) return this;

    if (!this.isValidEmail(this.value)) {
      this.errors.push('Must be a valid email');
    }

    return this;
  }

  matchRegex(pattern: string, msg = 'Must match with pattern'): this {
    if (!this.validate) return this;

    const rgx = new RegExp(pattern);
    if (!this.value || !rgx.test(this.value)) {
      this.errors.push(msg);
    }

    return this;
  }

  isAlphaNumeric(msg = 'Must contain letter and number'): this {
    return this.matchRegex('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{0,}$', msg);
  }

  isAlphaNumericSymbol(
    msg = 'Must contain letter, number and special character',
  ): this {
    return this.matchRegex(
      '^(?=(.*\\d){1})(?=.*[a-zA-Z])(?=.*[^a-zA-Z\\d]).{0,}$',
      msg,
    );
  }

  length(min: number, max: number): this {
    return this.min(min).max(max);
  }

  min(min: number): this {
    if (!this.validate) return this;

    if (!this.value || this.value.length < min) {
      this.errors.push(`Must be at least ${min} characters`);
    }

    return this;
  }

  max(max: number): this {
    if (!this.validate) return this;

    if (this.value && this.value.length > max) {
      this.errors.push(`Must not exceed ${max} characters`);
    }

    return this;
  }

  in(arr: string[]): this {
    if (!this.validate) return this;

    if (!this.value || !arr.includes(this.value)) {
      this.errors.push('Invalid value');
    }

    return this;
  }

  match(str: string, msg = 'Must be matching'): this {
    if (!this.validate) return this;

    if (this.value !== null && this.value !== str) {
      this.errors.push(msg);
    }

    return this;
  }

  private isValidEmail(email: string | null): boolean {
    if (!email) return false;

    // Standard Unicode-safe email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    return emailRegex.test(email);
  }
}
