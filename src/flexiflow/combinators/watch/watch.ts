import {Flexible} from '../../flexible';
import {Optional} from '../../optional';
import {FlexibleOrUnit, MultipleKeysWrapsToOptional} from '../../types';
import {isFunction} from '../../utils';
import {isFlexibleOrUnit} from '../../utils/isFlexibleOrUnit';
import {isFlexibleOrUnitObject} from '../../utils/isFlexibleOrUnitObject';
import {get} from '../get';
import {getCombinatorError} from '../getCombinatorError';

export function watch<A>(args: FlexibleOrUnit<A>, fn: (value: A) => void): Flexible<A>;
export function watch<A extends Record<string, FlexibleOrUnit<unknown>>>(
  args: A,
  fn: (value: MultipleKeysWrapsToOptional<A>) => void,
): Flexible<MultipleKeysWrapsToOptional<A>>;
export function watch<A>(args: [FlexibleOrUnit<A>], fn: (value: A) => void): Flexible<A>;
export function watch<A, B>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>],
  fn: (value: [Optional<A>, Optional<B>]) => void,
): Flexible<[Optional<A>, Optional<B>]>;
export function watch<A, B, C>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>],
  fn: (value: [Optional<A>, Optional<B>, Optional<C>]) => void,
): Flexible<[Optional<A>, Optional<B>, Optional<C>]>;
export function watch<A, B, C, D>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>, FlexibleOrUnit<D>],
  fn: (value: [Optional<A>, Optional<B>, Optional<C>, Optional<D>]) => void,
): Flexible<[Optional<A>, Optional<B>, Optional<C>, Optional<D>]>;
export function watch<A, B>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  fn?: (value: [Optional<A>, Optional<B>]) => void,
): Flexible<[Optional<A>, Optional<B>]>;
export function watch<A, B, C>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  fn?: (value: [Optional<A>, Optional<B>, Optional<C>]) => void,
): Flexible<[Optional<A>, Optional<B>, Optional<C>]>;
export function watch<A, B, C, D>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  d?: FlexibleOrUnit<D>,
  fn?: (value: [Optional<A>, Optional<B>, Optional<C>, Optional<D>]) => void,
): Flexible<[Optional<A>, Optional<B>, Optional<C>, Optional<D>]>;
export function watch(...args: unknown[]): Flexible<unknown> {
  const argsLength = args.length;
  if (argsLength < 2) return getCombinatorError('watch');

  const fn = args.pop();
  const firstArg = args[0];

  if (!isFunction(fn)) return getCombinatorError('watch');

  if (Array.isArray(firstArg)) {
    if (firstArg.length === 1) {
      return watchForSingleArg(firstArg[0], fn);
    }

    return watchForArray(firstArg, fn);
  }

  if (isFlexibleOrUnit(firstArg) && argsLength === 2) {
    return watchForSingleArg(firstArg, fn);
  }

  if (isFlexibleOrUnitObject(firstArg)) {
    const results: Record<string, Optional<unknown> | unknown> = {};
    const keys = Object.keys(firstArg);

    if (keys.length === 1) {
      return new Flexible((subscriber) => {
        const current = get(firstArg[keys[0]]);

        const unsubscribe = current.subscribe((value) => {
          results[keys[0]] = value;

          subscriber.next(results);
          fn(results);
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

          subscriber.next(results);
          fn(results);
        });
      });

      return () => {
        subscriber.unsubscribe();
        unsubscribes.forEach((subscription) => subscription.unsubscribe());
      };
    });
  }

  if (args.every((arg) => isFlexibleOrUnit(arg))) {
    return watchForArray(args as FlexibleOrUnit<unknown>[], fn);
  }

  return getCombinatorError('watch');
}

function watchForArray(units: FlexibleOrUnit<unknown>[], fn: (arr: unknown[]) => void): Flexible<unknown[]> {
  const results: Optional<unknown>[] = new Array(units.length).fill(Optional.none());

  return new Flexible((subscriber) => {
    const unsubscribes = units.map((unit, i) => {
      const current = get(unit);

      return current.subscribe((value) => {
        results[i] = Optional.of(value);

        subscriber.next(results);
        fn(results);
      });
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribes.forEach((subscription) => subscription.unsubscribe());
    };
  });
}

function watchForSingleArg(arg: FlexibleOrUnit<unknown>, fn: (value: unknown) => void): Flexible<unknown> {
  return new Flexible((subscriber) => {
    const current = get(arg);

    const unsubscribe = current.subscribe((value) => {
      subscriber.next(value);
      fn(value);
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribe.unsubscribe();
    };
  });
}
