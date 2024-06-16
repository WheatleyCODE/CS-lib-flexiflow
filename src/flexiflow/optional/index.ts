import { OptionalValue } from '../types';

export interface Optional<T> {
  get: () => OptionalValue<T>
  err: () => OptionalValue<T>
}