import {Flexible} from '../../flexible';
import {Optional} from '../../optional';
import {FlexibleOrUnit, MultipleKeysWrapsToOptional} from '../../types';
import {isFlexibleOrUnit} from '../../utils/isFlexibleOrUnit';
import {isFlexibleOrUnitObject} from '../../utils/isFlexibleOrUnitObject';
import {get} from '../get';
import {getCombinatorError} from '../getCombinatorError';

export function enumerable<A>(args: FlexibleOrUnit<A>): Flexible<[A, number]>;
export function enumerable<A extends Record<string, FlexibleOrUnit<unknown>>>(args: A): Flexible<[MultipleKeysWrapsToOptional<A>, number]>;
export function enumerable<A>(args: [FlexibleOrUnit<A>]): Flexible<[A, number]>;
export function enumerable<A, B>(args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>]): Flexible<[[Optional<A>, Optional<B>], number]>;
export function enumerable<A, B, C>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>],
): Flexible<[[Optional<A>, Optional<B>, Optional<C>], number]>;
export function enumerable<A, B, C, D>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>, FlexibleOrUnit<D>],
): Flexible<[[Optional<A>, Optional<B>, Optional<C>, Optional<D>], number]>;
export function enumerable<A, B>(a: FlexibleOrUnit<A>, b?: FlexibleOrUnit<B>): Flexible<[[Optional<A>, Optional<B>], A]>;
export function enumerable<A, B, C>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
): Flexible<[[Optional<A>, Optional<B>, Optional<C>], number]>;
export function enumerable<A, B, C, D>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  d?: FlexibleOrUnit<D>,
): Flexible<[[Optional<A>, Optional<B>, Optional<C>, Optional<D>], number]>;
export function enumerable(...args: unknown[]): Flexible<unknown> {
  const argsLength = args.length;

  const firstArg = args[0];

  if (Array.isArray(firstArg)) {
    if (firstArg.length === 1) {
      return enumerableForSingleArg(firstArg[0]);
    }

    return enumerableForArray(firstArg);
  }

  if (isFlexibleOrUnit(firstArg) && argsLength === 1) {
    return enumerableForSingleArg(firstArg);
  }

  if (isFlexibleOrUnitObject(firstArg)) {
    const results: Record<string, Optional<unknown> | unknown> = {};
    let count = 0;
    const keys = Object.keys(firstArg);

    if (keys.length === 1) {
      return new Flexible((subscriber) => {
        const current = get(firstArg[keys[0]]);

        const unsubscribe = current.subscribe((value) => {
          results[keys[0]] = value;
          const arr = new Array(2);

          arr[0] = results;
          arr[1] = ++count;

          subscriber.next(arr);
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
          const arr = new Array(2);

          arr[0] = results;
          arr[1] = ++count;

          subscriber.next(arr);
        });
      });

      return () => {
        subscriber.unsubscribe();
        unsubscribes.forEach((subscription) => subscription.unsubscribe());
      };
    });
  }

  if (args.every((arg) => isFlexibleOrUnit(arg))) {
    return enumerableForArray(args as FlexibleOrUnit<unknown>[]);
  }

  return getCombinatorError('enumerable');
}

function enumerableForArray(units: FlexibleOrUnit<unknown>[]): Flexible<unknown[]> {
  const results: Optional<unknown>[] = new Array(units.length).fill(Optional.none());
  let count = 0;

  return new Flexible((subscriber) => {
    const unsubscribes = units.map((unit, i) => {
      const current = get(unit);

      return current.subscribe((value) => {
        results[i] = Optional.of(value);
        const arr = new Array(2);

        arr[0] = results;
        arr[1] = ++count;

        subscriber.next(arr);
      });
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribes.forEach((subscription) => subscription.unsubscribe());
    };
  });
}

function enumerableForSingleArg(arg: FlexibleOrUnit<unknown>): Flexible<unknown[]> {
  let count = 0;

  return new Flexible((subscriber) => {
    const current = get(arg);

    const unsubscribe = current.subscribe((value) => {
      const arr = new Array(2);

      arr[0] = value;
      arr[1] = ++count;

      subscriber.next(arr);
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribe.unsubscribe();
    };
  });
}
