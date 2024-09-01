import {Flexible} from '../../flexible';
import {FlexibleOrUnit} from '../../types';
import {isFlexibleOrUnit} from '../../utils/isFlexibleOrUnit';
import {isFlexibleOrUnitObject} from '../../utils/isFlexibleOrUnitObject';
import {get} from '../get';
import {getCombinatorError} from '../getCombinatorError';

export function seqTime<A>(args: FlexibleOrUnit<A>, timeMS: number): Flexible<A>;
export function seqTime<A extends Record<string, FlexibleOrUnit<unknown>>>(
  args: A,
  timeMS: number,
): Flexible<{[K in keyof A]: A[K] extends FlexibleOrUnit<infer R> ? R : never}>;
export function seqTime<A>(args: [FlexibleOrUnit<A>], timeMS: number): Flexible<A>;
export function seqTime<A, B>(args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>], timeMS: number): Flexible<[A, B]>;
export function seqTime<A, B, C>(args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>], timeMS: number): Flexible<[A, B, C]>;
export function seqTime<A, B, C, D>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>, FlexibleOrUnit<D>],
  timeMS: number,
): Flexible<[A, B, C, D]>;
export function seqTime<A, B>(a: FlexibleOrUnit<A>, b?: FlexibleOrUnit<B>, timeMS?: number): Flexible<[A, B]>;
export function seqTime<A, B, C>(a: FlexibleOrUnit<A>, b?: FlexibleOrUnit<B>, c?: FlexibleOrUnit<C>, timeMS?: number): Flexible<[A, B, C]>;
export function seqTime<A, B, C, D>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  d?: FlexibleOrUnit<D>,
  timeMS?: number,
): Flexible<[A, B, C, D]>;
export function seqTime(...args: unknown[]): Flexible<unknown> {
  const argsLength = args.length;
  if (argsLength < 2) return getCombinatorError('seqTime');

  const timeMS = args.pop();
  const firstArg = args[0];

  if (typeof timeMS !== 'number') return getCombinatorError('seqTime');

  if (Array.isArray(firstArg)) {
    if (firstArg.length === 1) {
      return get(firstArg[0]);
    }

    return seqTimeForArray(firstArg, timeMS);
  }

  if (isFlexibleOrUnit(firstArg) && argsLength === 2) {
    return get(firstArg);
  }

  if (isFlexibleOrUnitObject(firstArg)) {
    let results: Record<string, unknown> = {};

    let timer: NodeJS.Timeout | null = null;

    const debouncedClear = () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        results = {};
      }, timeMS);
    };

    return new Flexible((subscriber) => {
      const keys = Object.keys(firstArg);

      const unsubscribes = keys.map((key) => {
        const current = get(firstArg[key]);

        return current.subscribe((value) => {
          results[key] = value;

          if (keys.every((key) => results[key] !== undefined)) {
            subscriber.next(results);
          }

          debouncedClear();
        });
      });

      return () => {
        subscriber.unsubscribe();
        unsubscribes.forEach((subscription) => subscription.unsubscribe());
      };
    });
  }

  if (args.every((arg) => isFlexibleOrUnit(arg))) {
    return seqTimeForArray(args as FlexibleOrUnit<unknown>[], timeMS);
  }

  return getCombinatorError('seqTime');
}

function seqTimeForArray(units: FlexibleOrUnit<unknown>[], timeMS: number): Flexible<unknown[]> {
  let results: unknown[] = new Array(units.length).fill(undefined);
  let timer: NodeJS.Timeout | null = null;

  const debouncedClear = () => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      results = new Array(units.length).fill(undefined);
    }, timeMS);
  };

  return new Flexible((subscriber) => {
    const unsubscribes = units.map((unit, i) => {
      const current = get(unit);

      return current.subscribe((value) => {
        results[i] = value;

        if (results.every((item) => item !== undefined)) {
          subscriber.next(results);
        }

        debouncedClear();
      });
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribes.forEach((subscription) => subscription.unsubscribe());
    };
  });
}
