import {Optional} from './Optional';

describe('Optional', () => {
  test('Optional.some should create an Optional with a non-null value', () => {
    const optional = Optional.some(5);

    expect(optional.isSome()).toBe(true);
    expect(optional.isNone()).toBe(false);
    expect(optional.unwrap()).toBe(5);
  });

  test('Optional.some should throw an error when called with null or undefined', () => {
    expect(() => Optional.some(null)).toThrow('Optional.some cannot be called with null or undefined');
    expect(() => Optional.some(undefined)).toThrow('Optional.some cannot be called with null or undefined');
  });

  test('Optional.none should create an Optional with a null value', () => {
    const optional = Optional.none<number>();

    expect(optional.isSome()).toBe(false);
    expect(optional.isNone()).toBe(true);
    expect(optional.unwrap()).toBeNull();
  });

  test('Optional.of should create an Optional with a value when passed a non-null value', () => {
    const optional = Optional.of(10);

    expect(optional.isSome()).toBe(true);
    expect(optional.unwrap()).toBe(10);
  });

  test('Optional.of should create an Optional.none when passed null or undefined', () => {
    const optionalNull = Optional.of(null);
    const optionalUndefined = Optional.of(undefined);

    expect(optionalNull.isNone()).toBe(true);
    expect(optionalUndefined.isNone()).toBe(true);
  });

  test('Optional.of should return the same Optional if an Optional is passed', () => {
    const original = Optional.some(15);
    const wrapped = Optional.of(original);

    expect(wrapped).toBe(original);
  });

  test('isSome should return true if the Optional contains a value', () => {
    const optional = Optional.some('hello');

    expect(optional.isSome()).toBe(true);
    expect(optional.isNone()).toBe(false);
  });

  test('isNone should return true if the Optional contains null or undefined', () => {
    const optional = Optional.none<number>();

    expect(optional.isNone()).toBe(true);
    expect(optional.isSome()).toBe(false);
  });

  test('map should apply a function to the value if it is present', () => {
    const optional = Optional.some(2);
    const mapped = optional.map((x) => x * 2);

    expect(mapped.isSome()).toBe(true);
    expect(mapped.unwrap()).toBe(4);
  });

  test('map should return Optional.none if the Optional is none', () => {
    const optional = Optional.none<number>();
    const mapped = optional.map((x) => x * 2);

    expect(mapped.isNone()).toBe(true);
  });

  test('flatMap should apply a function that returns an Optional if the value is present', () => {
    const optional = Optional.some(3);
    const flatMapped = optional.flatMap((x) => Optional.some(x * 3));

    expect(flatMapped.isSome()).toBe(true);
    expect(flatMapped.unwrap()).toBe(9);
  });

  test('flatMap should return Optional.none if the Optional is none', () => {
    const optional = Optional.none<number>();
    const flatMapped = optional.flatMap((x) => Optional.some(x * 3));

    expect(flatMapped.isNone()).toBe(true);
  });

  test('getOrElse should return the value if present, otherwise the default value', () => {
    const someOptional = Optional.some('present');
    const noneOptional = Optional.none<string>();

    expect(someOptional.getOrElse('default')).toBe('present');
    expect(noneOptional.getOrElse('default')).toBe('default');
  });

  test('getOrThrow should return the value if present, otherwise throw the given error', () => {
    const optional = Optional.some(42);
    expect(optional.getOrThrow(new Error('No value'))).toBe(42);

    const noneOptional = Optional.none<number>();
    expect(() => noneOptional.getOrThrow(new Error('No value'))).toThrow('No value');
  });

  test('ifSome should execute the function if a value is present', () => {
    const optional = Optional.some(5);
    const mockFn = jest.fn();
    optional.ifSome(mockFn);

    expect(mockFn).toHaveBeenCalledWith(5);
  });

  test('ifSome should not execute the function if no value is present', () => {
    const optional = Optional.none<number>();
    const mockFn = jest.fn();
    optional.ifSome(mockFn);

    expect(mockFn).not.toHaveBeenCalled();
  });

  test('ifNone should execute the function if no value is present', () => {
    const optional = Optional.none<number>();
    const mockFn = jest.fn();
    optional.ifNone(mockFn);

    expect(mockFn).toHaveBeenCalled();
  });

  test('ifNone should not execute the function if a value is present', () => {
    const optional = Optional.some(10);
    const mockFn = jest.fn();
    optional.ifNone(mockFn);

    expect(mockFn).not.toHaveBeenCalled();
  });

  test('unwrap should return the value if present', () => {
    const optional = Optional.some(20);

    expect(optional.unwrap()).toBe(20);
  });

  test('unwrap should return null if the value is none', () => {
    const optional = Optional.none<number>();

    expect(optional.unwrap()).toBeNull();
  });
});
