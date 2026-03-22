import { Result } from '../../../Services/Validations/Props/Result';

export class Property {
  protected readonly name: string;
  protected required: boolean;
  protected validate = true;
  protected isNull = true;
  protected errors: string[] = [];

  constructor(name: string, required: boolean) {
    this.name = name;
    this.required = required;
  }

  protected prepare(): void {
    if (!this.required && this.isNull) {
      this.validate = false;
    }

    if (this.validate && this.isNull) {
      this.errors.push('Please fill out this field.');
    }
  }

  results(): Result {
    return {
      name: this.name,
      errors: this.errors,
    };
  }

  addError(message: string): void {
    this.errors.push(message);
  }
}
