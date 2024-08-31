import {Flexible} from '../../flexible';
import {Optional} from '../../optional';
import {FlexibleOrUnit, MultipleKeysWrapsToOptional, TupleOf} from '../../types';
import {isFunction} from '../../utils';
import {isFlexibleOrUnit} from '../../utils/isFlexibleOrUnit';
import {isFlexibleOrUnitObject} from '../../utils/isFlexibleOrUnitObject';
import {get} from '../get';
import {getCombinatorError} from '../getCombinatorError';

export function checkBefore<A, N extends number>(
  args: FlexibleOrUnit<A>,
  count: N,
  predicate: (value: A, prevValues: TupleOf<A, N>) => boolean,
): Flexible<A>;
export function checkBefore<A extends Record<string, FlexibleOrUnit<unknown>>, N extends number>(
  args: A,
  count: N,
  predicate: (value: MultipleKeysWrapsToOptional<A>, prevValues: TupleOf<MultipleKeysWrapsToOptional<A>, N>) => boolean,
): Flexible<MultipleKeysWrapsToOptional<A>>;
export function checkBefore<A, N extends number>(
  args: [FlexibleOrUnit<A>],
  count: N,
  predicate: (value: A, prevValues: TupleOf<A, N>) => boolean,
): Flexible<A>;
export function checkBefore<A, B, N extends number>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>],
  count: N,
  predicate: (value: [Optional<A>, Optional<B>], prevValues: TupleOf<[Optional<A>, Optional<B>], N>) => boolean,
): Flexible<[Optional<A>, Optional<B>]>;
export function checkBefore<A, B, C, N extends number>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>],
  count: N,
  predicate: (value: [Optional<A>, Optional<B>, Optional<C>], prevValues: TupleOf<[Optional<A>, Optional<B>, Optional<C>], N>) => boolean,
): Flexible<[Optional<A>, Optional<B>, Optional<C>]>;
export function checkBefore<A, B, C, D, N extends number>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>, FlexibleOrUnit<D>],
  count: N,
  predicate: (
    value: [Optional<A>, Optional<B>, Optional<C>, Optional<D>],
    prevValues: TupleOf<[Optional<A>, Optional<B>, Optional<C>, Optional<D>], N>,
  ) => boolean,
): Flexible<[Optional<A>, Optional<B>, Optional<C>, Optional<D>]>;
export function checkBefore<A, B, N extends number>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  count?: N,
  predicate?: (value: [Optional<A>, Optional<B>], prevValues: TupleOf<[Optional<A>, Optional<B>], N>) => boolean,
): Flexible<[Optional<A>, Optional<B>]>;
export function checkBefore<A, B, C, N extends number>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  count?: N,
  predicate?: (value: [Optional<A>, Optional<B>, Optional<C>], prevValues: TupleOf<[Optional<A>, Optional<B>, Optional<C>], N>) => boolean,
): Flexible<[Optional<A>, Optional<B>, Optional<C>]>;
export function checkBefore<A, B, C, D, N extends number>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  d?: FlexibleOrUnit<D>,
  count?: N,
  predicate?: (
    value: [Optional<A>, Optional<B>, Optional<C>, Optional<D>],
    prevValues: TupleOf<[Optional<A>, Optional<B>, Optional<C>, Optional<D>], N>,
  ) => boolean,
): Flexible<[Optional<A>, Optional<B>, Optional<C>, Optional<D>]>;
export function checkBefore(...args: unknown[]): Flexible<unknown> {
  const argsLength = args.length;
  if (argsLength < 3) return getCombinatorError('checkBefore');

  const predicate = args.pop();
  const count = args.pop();
  const firstArg = args[0];

  if (!isFunction(predicate) || typeof count !== 'number') return getCombinatorError('checkBefore');

  if (Array.isArray(firstArg)) {
    if (firstArg.length === 1) {
      return checkBeforeForSingleArg(firstArg[0], count, predicate);
    }

    return checkBeforeForArray(firstArg, count, predicate);
  }

  if (isFlexibleOrUnit(firstArg) && argsLength === 3) {
    return checkBeforeForSingleArg(firstArg, count, predicate);
  }

  if (isFlexibleOrUnitObject(firstArg)) {
    const prevValues: Record<string, Optional<unknown> | unknown>[] = [];
    const results: Record<string, Optional<unknown> | unknown> = {};
    const keys = Object.keys(firstArg);

    if (keys.length === 1) {
      const currentKey = keys[0];

      return new Flexible((subscriber) => {
        const current = get(firstArg[currentKey]);

        const unsubscribe = current.subscribe((value) => {
          results[currentKey] = value;

          if (prevValues.length === count && predicate(value, [...prevValues])) {
            subscriber.next({...results});
          }

          if (prevValues.length < count) {
            prevValues.unshift({...results});
            return;
          }

          prevValues.pop();
          prevValues.unshift({...results});
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

          if (prevValues.length === count && predicate({...results}, [...prevValues])) {
            subscriber.next({...results});
          }

          if (prevValues.length < count) {
            prevValues.unshift({...results});
            return;
          }

          prevValues.pop();
          prevValues.unshift({...results});
        });
      });

      return () => {
        subscriber.unsubscribe();
        unsubscribes.forEach((subscription) => subscription.unsubscribe());
      };
    });
  }

  if (args.every((arg) => isFlexibleOrUnit(arg))) {
    return checkBeforeForArray(args as FlexibleOrUnit<unknown>[], count, predicate);
  }

  return getCombinatorError('checkBefore');
}

function checkBeforeForArray(
  units: FlexibleOrUnit<unknown>[],
  count: number,
  predicate: (value: unknown, prevValues: unknown[]) => boolean,
): Flexible<unknown[]> {
  const prevValues: Optional<unknown>[][] = [];
  const results: Optional<unknown>[] = new Array(units.length).fill(Optional.none());

  return new Flexible((subscriber) => {
    const unsubscribes = units.map((unit, i) => {
      const current = get(unit);

      return current.subscribe((value) => {
        results[i] = Optional.of(value);

        if (prevValues.length === count && predicate(results, [...prevValues])) {
          subscriber.next([...results]);
        }

        if (prevValues.length < count) {
          prevValues.unshift([...results]);
          return;
        }

        prevValues.pop();
        prevValues.unshift([...results]);
      });
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribes.forEach((subscription) => subscription.unsubscribe());
    };
  });
}

function checkBeforeForSingleArg(
  unit: FlexibleOrUnit<unknown>,
  count: number,
  predicate: (value: unknown, prevValues: unknown[]) => boolean,
): Flexible<unknown> {
  const prevValues: unknown[] = [];

  return new Flexible((subscriber) => {
    const current = get(unit);

    const unsubscribe = current.subscribe((value) => {
      if (prevValues.length === count && predicate(value, [...prevValues])) {
        subscriber.next(value);
      }

      if (prevValues.length < count) {
        prevValues.unshift(value);
        return;
      }

      prevValues.pop();
      prevValues.unshift(value);
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribe.unsubscribe();
    };
  });
}
