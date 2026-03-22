import { Property } from '../../../Services/Validations/Props/Property';

export class ObjectProperty extends Property {
  protected value: unknown;

  constructor(val: unknown, name: string, required: boolean) {
    super(name, required);

    this.value = val;
    this.isNull = val === null;

    this.prepare();
  }
}
