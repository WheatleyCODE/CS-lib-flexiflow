import {Flexible} from '../../flexible';
import {Optional} from '../../optional';
import {FlexibleOrUnit, MultipleKeysWrapsToOptional} from '../../types';
import {isFunction} from '../../utils';
import {isFlexibleOrUnit} from '../../utils/isFlexibleOrUnit';
import {isFlexibleOrUnitObject} from '../../utils/isFlexibleOrUnitObject';
import {get} from '../get';
import {getCombinatorError} from '../getCombinatorError';

export function filter<A>(args: FlexibleOrUnit<A>, predicate: (value: A) => boolean): Flexible<A>;
export function filter<A extends Record<string, FlexibleOrUnit<unknown>>>(
  args: A,
  predicate: (value: MultipleKeysWrapsToOptional<A>) => boolean,
): Flexible<MultipleKeysWrapsToOptional<A>>;
export function filter<A>(args: [FlexibleOrUnit<A>], predicate: (value: A) => boolean): Flexible<A>;
export function filter<A, B>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>],
  predicate: (value: [Optional<A>, Optional<B>]) => boolean,
): Flexible<[Optional<A>, Optional<B>]>;
export function filter<A, B, C>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>],
  predicate: (value: [Optional<A>, Optional<B>, Optional<C>]) => boolean,
): Flexible<[Optional<A>, Optional<B>, Optional<C>]>;
export function filter<A, B, C, D>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>, FlexibleOrUnit<D>],
  predicate: (value: [Optional<A>, Optional<B>, Optional<C>, Optional<D>]) => boolean,
): Flexible<[Optional<A>, Optional<B>, Optional<C>, Optional<D>]>;
export function filter<A, B>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  predicate?: (value: [Optional<A>, Optional<B>]) => boolean,
): Flexible<[Optional<A>, Optional<B>]>;
export function filter<A, B, C>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  predicate?: (value: [Optional<A>, Optional<B>, Optional<C>]) => boolean,
): Flexible<[Optional<A>, Optional<B>, Optional<C>]>;
export function filter<A, B, C, D>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  d?: FlexibleOrUnit<D>,
  predicate?: (value: [Optional<A>, Optional<B>, Optional<C>, Optional<D>]) => boolean,
): Flexible<[Optional<A>, Optional<B>, Optional<C>, Optional<D>]>;
export function filter(...args: unknown[]): Flexible<unknown> {
  const argsLength = args.length;
  if (argsLength < 2) return getCombinatorError('filter');

  const predicate = args.pop();
  const firstArg = args[0];

  if (!isFunction(predicate)) return getCombinatorError('filter');

  if (Array.isArray(firstArg)) {
    if (firstArg.length === 1) {
      return filterForSingleArg(firstArg[0], predicate);
    }

    return filterForArray(firstArg, predicate);
  }

  if (isFlexibleOrUnit(firstArg) && argsLength === 2) {
    return filterForSingleArg(firstArg, predicate);
  }

  if (isFlexibleOrUnitObject(firstArg)) {
    const results: Record<string, Optional<unknown> | unknown> = {};
    const keys = Object.keys(firstArg);

    if (keys.length === 1) {
      return new Flexible((subscriber) => {
        const current = get(firstArg[keys[0]]);

        const unsubscribe = current.subscribe((value) => {
          results[keys[0]] = value;

          if (predicate(results)) {
            subscriber.next(results);
          }
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

          if (predicate(results)) {
            subscriber.next(results);
          }
        });
      });

      return () => {
        subscriber.unsubscribe();
        unsubscribes.forEach((subscription) => subscription.unsubscribe());
      };
    });
  }

  if (args.every((arg) => isFlexibleOrUnit(arg))) {
    return filterForArray(args as FlexibleOrUnit<unknown>[], predicate);
  }

  return getCombinatorError('filter');
}

function filterForArray(units: FlexibleOrUnit<unknown>[], predicate: (arr: unknown[]) => boolean): Flexible<unknown[]> {
  const results: Optional<unknown>[] = new Array(units.length).fill(Optional.none());

  return new Flexible((subscriber) => {
    const unsubscribes = units.map((unit, i) => {
      const current = get(unit);

      return current.subscribe((value) => {
        results[i] = Optional.of(value);

        if (predicate(results)) {
          subscriber.next(results);
        }
      });
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribes.forEach((subscription) => subscription.unsubscribe());
    };
  });
}

function filterForSingleArg(arg: FlexibleOrUnit<unknown>, predicate: (value: unknown) => boolean): Flexible<unknown> {
  return new Flexible((subscriber) => {
    const current = get(arg);

    const unsubscribe = current.subscribe((value) => {
      if (predicate(value)) {
        subscriber.next(value);
      }
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribe.unsubscribe();
    };
  });
}
