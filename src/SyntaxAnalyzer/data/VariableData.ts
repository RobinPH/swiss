import { BaseData, DataMetadata } from "./BaseData";

export type VariableMetadata = {
  nullable: boolean;
};

export class VariableData<T extends string> extends BaseData<VariableMetadata> {
  constructor(
    type: T,
    metadata: Omit<DataMetadata & VariableMetadata, "type" | "nullable"> & {
      nullable?: boolean;
    }
  ) {
    super({
      ...metadata,
      nullable: metadata.nullable ?? false,
      type,
    });
  }
}
