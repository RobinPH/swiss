import { PrimitiveData } from "./PrimitiveData";
import { PrimitiveDataType } from "./types";

export class BooleanData extends PrimitiveData<
  PrimitiveDataType.BOOLEAN,
  boolean
> {
  constructor(
    metadata: ConstructorParameters<
      typeof PrimitiveData<PrimitiveDataType.BOOLEAN, boolean>
    >[1]
  ) {
    super(PrimitiveDataType.BOOLEAN, metadata);
  }

  isValidValue(rawValue: string): boolean {
    return BooleanData.isValidValue(rawValue);
  }

  static isValidValue(rawValue: string) {
    switch (rawValue) {
      case "true":
      case "1":
      case "false":
      case "0":
        return true;
    }

    return false;
  }

  _parseValue(rawValue: string): boolean {
    switch (rawValue) {
      case "true":
      case "1":
        return true;
      case "false":
      case "0":
        return false;
    }

    throw new Error(`Invalid Boolean value "${rawValue}"`);
  }
}
