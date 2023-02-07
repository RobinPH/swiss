import { BaseData, DataMetadata } from "./BaseData";

type VariableValueMetadata = {
  rawValue?: string;
  nullable: boolean;
  constant: boolean;
};

export abstract class VariableValueData<
  Type extends string,
  Metadata extends {},
  Value
> extends BaseData<Metadata & VariableValueMetadata> {
  abstract isValidValue(rawValue: string): boolean;
  abstract _parseValue(rawValue: string): Value;

  constructor(
    type: Type,
    metadata: Omit<
      DataMetadata & Metadata & VariableValueMetadata,
      "type" | "nullable" | "constant"
    > & {
      nullable?: boolean;
      constant?: boolean;
    }
  ) {
    metadata.nullable ??= false;
    metadata.constant ??= false;
    // @ts-ignore
    super({
      type,
      ...metadata,
    });
    if (this.metadata.rawValue === undefined) {
      if (!this.metadata.nullable) {
        throw new Error(
          `Variable "${this.metadata.identifier}" is not nullable`
        );
      }
    } else {
      if (!this.isValidValue(this.metadata.rawValue)) {
        throw new Error(
          `Value "${this.metadata.rawValue}" is not assignable to type "${this.type}"`
        );
      }
    }
  }

  parseValue() {
    if (this.metadata.rawValue !== undefined) {
      return this._parseValue(this.metadata.rawValue);
    } else {
      if (this.metadata.nullable) {
        return null;
      }
    }

    throw new Error(
      `Unable to parse "${this.metadata.rawValue}" to type ${this.type}`
    );
  }

  get value() {
    return this.parseValue();
  }
}
