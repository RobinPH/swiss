export type DataMetadata = {
  type: string;
  identifier: string;
};

export abstract class BaseData<Metadata extends {} = {}> {
  #metadata: DataMetadata & Metadata;

  constructor(metadata: DataMetadata & Metadata) {
    this.#metadata = metadata;
  }

  get metadata() {
    return this.#metadata;
  }

  get type() {
    return this.metadata.type;
  }

  get identifier() {
    return this.metadata.identifier;
  }

  toJSON() {
    return {
      type: this.type,
      identifier: this.identifier,
      metadata: this.#metadata,
    };
  }
}
