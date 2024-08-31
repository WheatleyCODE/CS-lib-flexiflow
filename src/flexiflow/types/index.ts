import {Unit} from 'effector';
import {Flexible} from '../flexible';
import {Optional} from '../optional';

export type FlexibleOrUnit<T> = Flexible<T> | Unit<T>;

export type PossibleShapes = FlexibleOrUnit<unknown> | FlexibleOrUnit<unknown>[] | Record<string, FlexibleOrUnit<unknown>>;

export type MultipleKeysWrapsToOptional<T> = keyof T extends infer K
  ? K extends never
    ? never
    : K extends string
      ? keyof T extends K
        ? {[K in keyof T]: T[K] extends FlexibleOrUnit<infer J> ? J : never}
        : {[K in keyof T]: T[K] extends FlexibleOrUnit<infer J> ? Optional<J> : never}
      : never
  : never;

export type TupleOf<A, N extends number, R extends A[] = []> = R['length'] extends N ? R : TupleOf<A, N, [A, ...R]>;

export type ObjectFlexibleOrUnitValues<T> = T[keyof T] extends FlexibleOrUnit<infer R> ? R : never;
