import {Flexible} from '../../flexible';
import {Optional} from '../../optional';
import {FlexibleOrUnit, MultipleKeysWrapsToOptional, TupleOf} from '../../types';
import {isFunction} from '../../utils';
import {isFlexibleOrUnit} from '../../utils/isFlexibleOrUnit';
import {isFlexibleOrUnitObject} from '../../utils/isFlexibleOrUnitObject';
import {get} from '../get';
import {getCombinatorError} from '../getCombinatorError';

export function checkAfter<A, N extends number>(
  args: FlexibleOrUnit<A>,
  count: N,
  predicate: (value: A, futureValues: TupleOf<A, N>) => boolean,
): Flexible<A>;
export function checkAfter<A extends Record<string, FlexibleOrUnit<unknown>>, N extends number>(
  args: A,
  count: N,
  predicate: (value: MultipleKeysWrapsToOptional<A>, futureValues: TupleOf<MultipleKeysWrapsToOptional<A>, N>) => boolean,
): Flexible<MultipleKeysWrapsToOptional<A>>;
export function checkAfter<A, N extends number>(
  args: [FlexibleOrUnit<A>],
  count: N,
  predicate: (value: A, futureValues: TupleOf<A, N>) => boolean,
): Flexible<A>;
export function checkAfter<A, B, N extends number>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>],
  count: N,
  predicate: (value: [Optional<A>, Optional<B>], futureValues: TupleOf<[Optional<A>, Optional<B>], N>) => boolean,
): Flexible<[Optional<A>, Optional<B>]>;
export function checkAfter<A, B, C, N extends number>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>],
  count: N,
  predicate: (value: [Optional<A>, Optional<B>, Optional<C>], futureValues: TupleOf<[Optional<A>, Optional<B>, Optional<C>], N>) => boolean,
): Flexible<[Optional<A>, Optional<B>, Optional<C>]>;
export function checkAfter<A, B, C, D, N extends number>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>, FlexibleOrUnit<D>],
  count: N,
  predicate: (
    value: [Optional<A>, Optional<B>, Optional<C>, Optional<D>],
    futureValues: TupleOf<[Optional<A>, Optional<B>, Optional<C>, Optional<D>], N>,
  ) => boolean,
): Flexible<[Optional<A>, Optional<B>, Optional<C>, Optional<D>]>;
export function checkAfter<A, B, N extends number>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  count?: N,
  predicate?: (value: [Optional<A>, Optional<B>], futureValues: TupleOf<[Optional<A>, Optional<B>], N>) => boolean,
): Flexible<[Optional<A>, Optional<B>]>;
export function checkAfter<A, B, C, N extends number>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  count?: N,
  predicate?: (
    value: [Optional<A>, Optional<B>, Optional<C>],
    futureValues: TupleOf<[Optional<A>, Optional<B>, Optional<C>], N>,
  ) => boolean,
): Flexible<[Optional<A>, Optional<B>, Optional<C>]>;
export function checkAfter<A, B, C, D, N extends number>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  d?: FlexibleOrUnit<D>,
  count?: N,
  predicate?: (
    value: [Optional<A>, Optional<B>, Optional<C>, Optional<D>],
    futureValues: TupleOf<[Optional<A>, Optional<B>, Optional<C>, Optional<D>], N>,
  ) => boolean,
): Flexible<[Optional<A>, Optional<B>, Optional<C>, Optional<D>]>;
export function checkAfter(...args: unknown[]): Flexible<unknown> {
  const argsLength = args.length;
  if (argsLength < 3) return getCombinatorError('checkAfter');

  const predicate = args.pop();
  const count = args.pop();
  const firstArg = args[0];

  if (!isFunction(predicate) || typeof count !== 'number') return getCombinatorError('checkAfter');

  if (Array.isArray(firstArg)) {
    if (firstArg.length === 1) {
      return checkAfterForSingleArg(firstArg[0], count, predicate);
    }

    return checkAfterForArray(firstArg, count, predicate);
  }

  if (isFlexibleOrUnit(firstArg) && argsLength === 3) {
    return checkAfterForSingleArg(firstArg, count, predicate);
  }

  if (isFlexibleOrUnitObject(firstArg)) {
    const futureValues: Record<string, Optional<unknown> | unknown>[] = [];
    const results: Record<string, Optional<unknown> | unknown> = {};
    const keys = Object.keys(firstArg);
    let currentValue: Record<string, unknown | Optional<unknown>> | null = null;

    if (keys.length === 1) {
      const currentKey = keys[0];

      return new Flexible((subscriber) => {
        const current = get(firstArg[currentKey]);

        const unsubscribe = current.subscribe((value) => {
          results[currentKey] = value;

          if (!currentValue) {
            currentValue = {
              ...results,
            };

            return;
          }

          if (futureValues.length === count && predicate(currentValue, [...futureValues])) {
            subscriber.next(currentValue);
          }

          if (futureValues.length < count) {
            futureValues.push({...results});
            return;
          }

          currentValue = {...futureValues.shift()!};
          futureValues.push({...results});
        });

        return () => {
          subscriber.unsubscribe();
          unsubscribe.unsubscribe();
        };
      });
    }

    keys.forEach((key) => {
      results[key] = Optional.none();
    });

    return new Flexible((subscriber) => {
      const unsubscribes = keys.map((key) => {
        const current = get(firstArg[key]);

        return current.subscribe((value) => {
          results[key] = Optional.of(value);

          if (!currentValue) {
            currentValue = {
              ...results,
            };

            return;
          }

          if (futureValues.length === count && predicate(currentValue, [...futureValues])) {
            subscriber.next(currentValue);
          }

          if (futureValues.length < count) {
            futureValues.push({...results});
            return;
          }

          currentValue = {...futureValues.shift()!};
          futureValues.push({...results});
        });
      });

      return () => {
        subscriber.unsubscribe();
        unsubscribes.forEach((subscription) => subscription.unsubscribe());
      };
    });
  }

  if (args.every((arg) => isFlexibleOrUnit(arg))) {
    return checkAfterForArray(args as FlexibleOrUnit<unknown>[], count, predicate);
  }

  return getCombinatorError('checkAfter');
}

function checkAfterForArray(
  units: FlexibleOrUnit<unknown>[],
  count: number,
  predicate: (value: unknown, futureValues: unknown[]) => boolean,
): Flexible<unknown[]> {
  const futureValues: Optional<unknown>[][] = [];
  const results: Optional<unknown>[] = new Array(units.length).fill(Optional.none());

  let currentValue: Optional<unknown>[] | null = null;

  return new Flexible((subscriber) => {
    const unsubscribes = units.map((unit, i) => {
      const current = get(unit);

      return current.subscribe((value) => {
        results[i] = Optional.of(value);

        if (!currentValue) {
          currentValue = [...results];
          return;
        }

        if (futureValues.length === count && predicate(currentValue, [...futureValues])) {
          subscriber.next([...currentValue]);
        }

        if (futureValues.length < count) {
          futureValues.push([...results]);
          return;
        }

        currentValue = [...futureValues.shift()!];
        futureValues.push([...results]);
      });
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribes.forEach((subscription) => subscription.unsubscribe());
    };
  });
}

function checkAfterForSingleArg(
  unit: FlexibleOrUnit<unknown>,
  count: number,
  predicate: (value: unknown, futureValues: unknown[]) => boolean,
): Flexible<unknown> {
  const futureValues: unknown[] = [];
  let currentValue: unknown = null;

  return new Flexible((subscriber) => {
    const current = get(unit);

    const unsubscribe = current.subscribe((value) => {
      if (!currentValue) {
        currentValue = value;
        return;
      }

      if (futureValues.length === count && predicate(currentValue, [...futureValues])) {
        subscriber.next(currentValue);
      }

      if (futureValues.length < count) {
        futureValues.push(value);
        return;
      }

      currentValue = futureValues.shift();
      futureValues.push(value);
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribe.unsubscribe();
    };
  });
}
