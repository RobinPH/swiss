import { PrimitiveData } from "./PrimitiveData";
import { PrimitiveDataType } from "./types";

export class CharacterData extends PrimitiveData<
  PrimitiveDataType.CHARACTER,
  string
> {
  constructor(
    metadata: ConstructorParameters<
      typeof PrimitiveData<PrimitiveDataType.CHARACTER, string>
    >[1]
  ) {
    super(PrimitiveDataType.CHARACTER, metadata);
  }

  isValidValue(rawValue: string): boolean {
    return CharacterData.isValidValue(rawValue);
  }

  static isValidValue(rawValue: string) {
    return /"."/.test(rawValue) || /'.'/.test(rawValue) || /`.`/.test(rawValue);
  }

  _parseValue(rawValue: string): string {
    return rawValue[1];
  }
}
