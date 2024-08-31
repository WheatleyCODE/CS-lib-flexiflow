import {Flexible} from '../../flexible';
import {Optional} from '../../optional';
import {FlexibleOrUnit, MultipleKeysWrapsToOptional} from '../../types';
import {isFlexibleOrUnit} from '../../utils/isFlexibleOrUnit';
import {isFlexibleOrUnitObject} from '../../utils/isFlexibleOrUnitObject';
import {get} from '../get';
import {getCombinatorError} from '../getCombinatorError';

export function debounce<A>(args: FlexibleOrUnit<A>, timeMS: number): Flexible<A>;
export function debounce<A extends Record<string, FlexibleOrUnit<unknown>>>(
  args: A,
  timeMS: number,
): Flexible<MultipleKeysWrapsToOptional<A>>;
export function debounce<A>(args: [FlexibleOrUnit<A>], timeMS: number): Flexible<A>;
export function debounce<A, B>(args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>], timeMS: number): Flexible<[Optional<A>, Optional<B>]>;
export function debounce<A, B, C>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>],
  timeMS: number,
): Flexible<[Optional<A>, Optional<B>, Optional<C>]>;
export function debounce<A, B, C, D>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>, FlexibleOrUnit<D>],
  timeMS: number,
): Flexible<[Optional<A>, Optional<B>, Optional<C>, Optional<D>]>;
export function debounce<A, B>(a: FlexibleOrUnit<A>, b?: FlexibleOrUnit<B>, timeMS?: number): Flexible<[Optional<A>, Optional<B>]>;
export function debounce<A, B, C>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  timeMS?: number,
): Flexible<[Optional<A>, Optional<B>, Optional<C>]>;
export function debounce<A, B, C, D>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  d?: FlexibleOrUnit<D>,
  timeMS?: number,
): Flexible<[Optional<A>, Optional<B>, Optional<C>, Optional<D>]>;
export function debounce(...args: unknown[]): Flexible<unknown> {
  const argsLength = args.length;
  if (argsLength < 2) return getCombinatorError('debounce');

  const timeMS = args.pop();
  const firstArg = args[0];

  if (typeof timeMS !== 'number') return getCombinatorError('debounce');

  if (Array.isArray(firstArg)) {
    if (firstArg.length === 1) {
      return debounceForSingleArg(firstArg[0], timeMS);
    }

    return debounceForArray(firstArg, timeMS);
  }

  if (isFlexibleOrUnit(firstArg) && argsLength === 2) {
    return debounceForSingleArg(firstArg, timeMS);
  }

  if (isFlexibleOrUnitObject(firstArg)) {
    const results: Record<string, Optional<unknown> | unknown> = {};
    const keys = Object.keys(firstArg);

    let timer: NodeJS.Timeout | null = null;

    const debouncedFn = (fn: () => void) => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(fn, timeMS);
    };

    if (keys.length === 1) {
      return new Flexible((subscriber) => {
        const current = get(firstArg[keys[0]]);

        const unsubscribe = current.subscribe((value) => {
          results[keys[0]] = value;

          debouncedFn(() => subscriber.next(results));
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

          debouncedFn(() => subscriber.next(results));
        });
      });

      return () => {
        subscriber.unsubscribe();
        unsubscribes.forEach((subscription) => subscription.unsubscribe());
      };
    });
  }

  if (args.every((arg) => isFlexibleOrUnit(arg))) {
    return debounceForArray(args as FlexibleOrUnit<unknown>[], timeMS);
  }

  return getCombinatorError('debounce');
}

function debounceForArray(units: FlexibleOrUnit<unknown>[], timeMS: number): Flexible<unknown[]> {
  const results: Optional<unknown>[] = new Array(units.length).fill(Optional.none());

  let timer: NodeJS.Timeout | null = null;

  const debouncedFn = (fn: () => void) => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(fn, timeMS);
  };

  return new Flexible((subscriber) => {
    const unsubscribes = units.map((unit, i) => {
      const current = get(unit);

      return current.subscribe((value) => {
        results[i] = Optional.of(value);

        debouncedFn(() => subscriber.next(results));
      });
    });

    return () => {
      if (timer) clearTimeout(timer);
      subscriber.unsubscribe();
      unsubscribes.forEach((subscription) => subscription.unsubscribe());
    };
  });
}

function debounceForSingleArg(arg: FlexibleOrUnit<unknown>, timeMS: number): Flexible<unknown> {
  let timer: NodeJS.Timeout | null = null;

  const debouncedFn = (fn: () => void) => {
    if (timer) clearTimeout(timer);

    timer = setTimeout(fn, timeMS);
  };

  return new Flexible((subscriber) => {
    const current = get(arg);

    const unsubscribe = current.subscribe((value) => {
      debouncedFn(() => subscriber.next(value));
    });

    return () => {
      if (timer) clearTimeout(timer);
      subscriber.unsubscribe();
      unsubscribe.unsubscribe();
    };
  });
}
