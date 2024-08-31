export class Optional<T> {
  #value: T | null | undefined;

  private constructor(value: T | null | undefined) {
    this.#value = value;
  }

  static some<T>(value: T): Optional<T> {
    if (value === null || value === undefined) {
      throw new Error('Optional.some cannot be called with null or undefined');
    }

    return new Optional(value);
  }

  static none<T>(): Optional<T> {
    return new Optional<T>(null);
  }

  static of<T>(value: Optional<T>): Optional<T>;
  static of<T>(value: T): Optional<T>;
  static of<T>(value: T) {
    if (value instanceof Optional) {
      return value as Optional<T>;
    }

    if (value === null || value === undefined) {
      return Optional.none<T>();
    }

    return Optional.some<T>(value);
  }

  isSome(): boolean {
    return this.#value !== null && this.#value !== undefined;
  }

  isNone(): boolean {
    return !this.isSome();
  }

  map<U>(fn: (value: T) => U): Optional<U> {
    if (this.isSome()) {
      return Optional.some(fn(this.#value as T));
    }

    return Optional.none<U>();
  }

  flatMap<U>(fn: (value: T) => Optional<U>): Optional<U> {
    if (this.isSome()) {
      return fn(this.#value as T);
    }

    return Optional.none<U>();
  }

  getOrElse(defaultValue: T): T {
    return this.isSome() ? (this.#value as T) : defaultValue;
  }

  getOrThrow(error: Error): T {
    if (this.isSome()) {
      return this.#value as T;
    }

    throw error;
  }

  ifSome(fn: (value: T) => void): void {
    if (this.isSome()) {
      fn(this.#value as T);
    }
  }

  ifNone(fn: () => void): void {
    if (this.isNone()) {
      fn();
    }
  }

  unwrap(): T | null | undefined {
    return this.#value;
  }
}
