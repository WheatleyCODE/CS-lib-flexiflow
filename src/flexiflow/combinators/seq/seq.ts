import {Flexible} from '../../flexible';
import {FlexibleOrUnit} from '../../types';
import {isFlexibleOrUnit} from '../../utils/isFlexibleOrUnit';
import {isFlexibleOrUnitObject} from '../../utils/isFlexibleOrUnitObject';
import {get} from '../get';
import {getCombinatorError} from '../getCombinatorError';

export function seq<A>(args: FlexibleOrUnit<A>): Flexible<A>;
export function seq<A extends Record<string, FlexibleOrUnit<unknown>>>(
  args: A,
): Flexible<{[K in keyof A]: A[K] extends FlexibleOrUnit<infer R> ? R : never}>;
export function seq<A>(args: [FlexibleOrUnit<A>]): Flexible<A>;
export function seq<A, B>(args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>]): Flexible<[A, B]>;
export function seq<A, B, C>(args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>]): Flexible<[A, B, C]>;
export function seq<A, B, C, D>(args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>, FlexibleOrUnit<D>]): Flexible<[A, B, C, D]>;
export function seq<A, B>(a: FlexibleOrUnit<A>, b?: FlexibleOrUnit<B>): Flexible<[A, B]>;
export function seq<A, B, C>(a: FlexibleOrUnit<A>, b?: FlexibleOrUnit<B>, c?: FlexibleOrUnit<C>): Flexible<[A, B, C]>;
export function seq<A, B, C, D>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  d?: FlexibleOrUnit<D>,
): Flexible<[A, B, C, D]>;
export function seq(...args: unknown[]): Flexible<unknown> {
  const argsLength = args.length;
  if (argsLength < 1) return getCombinatorError('seq');

  const firstArg = args[0];

  if (Array.isArray(firstArg)) {
    if (firstArg.length === 1) {
      return get(firstArg[0]);
    }

    return seqForArray(firstArg);
  }

  if (isFlexibleOrUnit(firstArg) && argsLength === 1) {
    return get(firstArg);
  }

  if (isFlexibleOrUnitObject(firstArg)) {
    const results: Record<string, unknown> = {};

    return new Flexible((subscriber) => {
      const keys = Object.keys(firstArg);

      const unsubscribes = keys.map((key) => {
        const current = get(firstArg[key]);

        return current.subscribe((value) => {
          results[key] = value;

          if (keys.every((key) => results[key] !== undefined)) {
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
    return seqForArray(args as FlexibleOrUnit<unknown>[]);
  }

  return getCombinatorError('seq');
}

function seqForArray(units: FlexibleOrUnit<unknown>[]): Flexible<unknown[]> {
  const results: unknown[] = new Array(units.length).fill(undefined);

  return new Flexible((subscriber) => {
    const unsubscribes = units.map((unit, i) => {
      const current = get(unit);

      return current.subscribe((value) => {
        results[i] = value;

        if (results.every((item) => item !== undefined)) {
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
