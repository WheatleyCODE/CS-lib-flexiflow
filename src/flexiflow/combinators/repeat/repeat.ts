import {Flexible} from '../../flexible';
import {Optional} from '../../optional';
import {FlexibleOrUnit, MultipleKeysWrapsToOptional, TupleOf} from '../../types';
import {isFlexibleOrUnit} from '../../utils/isFlexibleOrUnit';
import {isFlexibleOrUnitObject} from '../../utils/isFlexibleOrUnitObject';
import {get} from '../get';
import {getCombinatorError} from '../getCombinatorError';

export function repeat<A, N extends number>(args: FlexibleOrUnit<A>, count: N): Flexible<TupleOf<A, N>>;
export function repeat<A extends Record<string, FlexibleOrUnit<unknown>>, N extends number>(
  args: A,
  count: N,
): Flexible<TupleOf<MultipleKeysWrapsToOptional<A>, N>>;
export function repeat<A, N extends number>(args: [FlexibleOrUnit<A>], count: N): Flexible<TupleOf<A, N>>;
export function repeat<A, B, N extends number>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>],
  count: N,
): Flexible<TupleOf<[Optional<A>, Optional<B>], N>>;
export function repeat<A, B, C, N extends number>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>],
  count: N,
): Flexible<TupleOf<[Optional<A>, Optional<B>, Optional<C>], N>>;
export function repeat<A, B, C, D, N extends number>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>, FlexibleOrUnit<D>],
  count: N,
): Flexible<TupleOf<[Optional<A>, Optional<B>, Optional<C>, Optional<D>], N>>;
export function repeat<A, B, N extends number>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  count?: N,
): Flexible<TupleOf<[Optional<A>, Optional<B>], N>>;
export function repeat<A, B, C, N extends number>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  count?: N,
): Flexible<TupleOf<[Optional<A>, Optional<B>, Optional<C>], N>>;
export function repeat<A, B, C, D, N extends number>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  d?: FlexibleOrUnit<D>,
  count?: N,
): Flexible<TupleOf<[Optional<A>, Optional<B>, Optional<C>, Optional<D>], N>>;
export function repeat(...args: unknown[]): Flexible<unknown> {
  const argsLength = args.length;
  if (argsLength < 2) return getCombinatorError('repeat');

  const count = args.pop();
  const firstArg = args[0];

  if (typeof count !== 'number') return getCombinatorError('repeat');

  if (Array.isArray(firstArg)) {
    if (firstArg.length === 1) {
      return repeatForSingleArg(firstArg[0], count);
    }

    return repeatForArray(firstArg, count);
  }

  if (isFlexibleOrUnit(firstArg) && argsLength === 2) {
    return repeatForSingleArg(firstArg, count);
  }

  if (isFlexibleOrUnitObject(firstArg)) {
    const results: Record<string, Optional<unknown> | unknown> = {};
    const keys = Object.keys(firstArg);

    if (keys.length === 1) {
      return new Flexible((subscriber) => {
        const current = get(firstArg[keys[0]]);

        const unsubscribe = current.subscribe((value) => {
          results[keys[0]] = value;
          const arr = new Array(count).fill(results);

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
          const arr = new Array(count).fill(results);

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
    return repeatForArray(args as FlexibleOrUnit<unknown>[], count);
  }

  return getCombinatorError('repeat');
}

function repeatForArray(units: FlexibleOrUnit<unknown>[], count: number): Flexible<unknown[]> {
  const results: Optional<unknown>[] = new Array(units.length).fill(Optional.none());

  return new Flexible((subscriber) => {
    const unsubscribes = units.map((unit, i) => {
      const current = get(unit);

      return current.subscribe((value) => {
        results[i] = Optional.of(value);
        const arr = new Array(count).fill(results);

        subscriber.next(arr);
      });
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribes.forEach((subscription) => subscription.unsubscribe());
    };
  });
}

function repeatForSingleArg(arg: FlexibleOrUnit<unknown>, count: number): Flexible<unknown[]> {
  return new Flexible((subscriber) => {
    const current = get(arg);

    const unsubscribe = current.subscribe((value) => {
      const arr = new Array(count).fill(value);

      subscriber.next(arr);
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribe.unsubscribe();
    };
  });
}
