import { PrimitiveData } from "./PrimitiveData";
import { PrimitiveDataType } from "./types";

export class IntegerData extends PrimitiveData<
  PrimitiveDataType.INTEGER,
  number
> {
  constructor(
    metadata: ConstructorParameters<
      typeof PrimitiveData<PrimitiveDataType.INTEGER, number>
    >[1]
  ) {
    super(PrimitiveDataType.INTEGER, metadata);
  }

  isValidValue(rawValue: string): boolean {
    return IntegerData.isValidValue(rawValue);
  }

  static isValidValue(rawValue: string) {
    return Number.isInteger(parseFloat(rawValue));
  }

  _parseValue(rawValue: string): number {
    return parseInt(rawValue);
  }
}
