import {Flexible} from '../../flexible';
import {Optional} from '../../optional';
import {FlexibleOrUnit, MultipleKeysWrapsToOptional} from '../../types';
import {isFunction} from '../../utils';
import {isFlexibleOrUnit} from '../../utils/isFlexibleOrUnit';
import {isFlexibleOrUnitObject} from '../../utils/isFlexibleOrUnitObject';
import {get} from '../get';
import {getCombinatorError} from '../getCombinatorError';

export function map<A, R>(args: FlexibleOrUnit<A>, executor: (value: A) => R): Flexible<R>;
export function map<A extends Record<string, FlexibleOrUnit<unknown>>, R>(
  args: A,
  executor: (value: MultipleKeysWrapsToOptional<A>) => R,
): Flexible<R>;
export function map<A, R>(args: [FlexibleOrUnit<A>], executor: (value: A) => R): Flexible<R>;
export function map<A, B, R>(args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>], executor: (value: [Optional<A>, Optional<B>]) => R): Flexible<R>;
export function map<A, B, C, R>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>],
  executor: (value: [Optional<A>, Optional<B>, Optional<C>]) => R,
): Flexible<R>;
export function map<A, B, C, D, R>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>, FlexibleOrUnit<D>],
  executor: (value: [Optional<A>, Optional<B>, Optional<C>, Optional<D>]) => R,
): Flexible<R>;
export function map<A, B, R>(a: FlexibleOrUnit<A>, b?: FlexibleOrUnit<B>, executor?: (value: [Optional<A>, Optional<B>]) => R): Flexible<R>;
export function map<A, B, C, R>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  executor?: (value: [Optional<A>, Optional<B>, Optional<C>]) => R,
): Flexible<R>;
export function map<A, B, C, D, R>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  d?: FlexibleOrUnit<D>,
  executor?: (value: [Optional<A>, Optional<B>, Optional<C>, Optional<D>]) => R,
): Flexible<R>;
export function map(...args: unknown[]): Flexible<unknown> {
  const argsLength = args.length;
  if (argsLength < 2) return getCombinatorError('map');

  const executor = args.pop();
  const firstArg = args[0];

  if (!isFunction(executor)) return getCombinatorError('map');

  if (Array.isArray(firstArg)) {
    if (firstArg.length === 1) {
      return mapForSingleArg(firstArg[0], executor);
    }

    return mapForArray(firstArg, executor);
  }

  if (isFlexibleOrUnit(firstArg) && argsLength === 2) {
    return mapForSingleArg(firstArg, executor);
  }

  if (isFlexibleOrUnitObject(firstArg)) {
    const results: Record<string, Optional<unknown> | unknown> = {};
    const keys = Object.keys(firstArg);

    if (keys.length === 1) {
      return new Flexible((subscriber) => {
        const current = get(firstArg[keys[0]]);

        const unsubscribe = current.subscribe((value) => {
          results[keys[0]] = value;

          subscriber.next(executor(results));
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

          subscriber.next(executor(results));
        });
      });

      return () => {
        subscriber.unsubscribe();
        unsubscribes.forEach((subscription) => subscription.unsubscribe());
      };
    });
  }

  if (args.every((arg) => isFlexibleOrUnit(arg))) {
    return mapForArray(args as FlexibleOrUnit<unknown>[], executor);
  }

  return getCombinatorError('map');
}

function mapForArray<T>(units: FlexibleOrUnit<unknown>[], executor: (arr: unknown[]) => T): Flexible<T> {
  const results: Optional<unknown>[] = new Array(units.length).fill(Optional.none());

  return new Flexible((subscriber) => {
    const unsubscribes = units.map((unit, i) => {
      const current = get(unit);

      return current.subscribe((value) => {
        results[i] = Optional.of(value);
        subscriber.next(executor(results));
      });
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribes.forEach((subscription) => subscription.unsubscribe());
    };
  });
}

function mapForSingleArg<T>(arg: FlexibleOrUnit<unknown>, executor: (arr: unknown) => T): Flexible<T> {
  return new Flexible((subscriber) => {
    const current = get(arg);

    const unsubscribe = current.subscribe((value) => {
      subscriber.next(executor(value));
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribe.unsubscribe();
    };
  });
}
