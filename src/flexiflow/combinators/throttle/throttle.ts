import {Flexible} from '../../flexible';
import {Optional} from '../../optional';
import {FlexibleOrUnit, MultipleKeysWrapsToOptional} from '../../types';
import {isFlexibleOrUnit} from '../../utils/isFlexibleOrUnit';
import {isFlexibleOrUnitObject} from '../../utils/isFlexibleOrUnitObject';
import {get} from '../get';
import {getCombinatorError} from '../getCombinatorError';

export function throttle<A>(args: FlexibleOrUnit<A>, timeMS: number): Flexible<A>;
export function throttle<A extends Record<string, FlexibleOrUnit<unknown>>>(
  args: A,
  timeMS: number,
): Flexible<MultipleKeysWrapsToOptional<A>>;
export function throttle<A>(args: [FlexibleOrUnit<A>], timeMS: number): Flexible<A>;
export function throttle<A, B>(args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>], timeMS: number): Flexible<[Optional<A>, Optional<B>]>;
export function throttle<A, B, C>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>],
  timeMS: number,
): Flexible<[Optional<A>, Optional<B>, Optional<C>]>;
export function throttle<A, B, C, D>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>, FlexibleOrUnit<D>],
  timeMS: number,
): Flexible<[Optional<A>, Optional<B>, Optional<C>, Optional<D>]>;
export function throttle<A, B>(a: FlexibleOrUnit<A>, b?: FlexibleOrUnit<B>, timeMS?: number): Flexible<[Optional<A>, Optional<B>]>;
export function throttle<A, B, C>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  timeMS?: number,
): Flexible<[Optional<A>, Optional<B>, Optional<C>]>;
export function throttle<A, B, C, D>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  d?: FlexibleOrUnit<D>,
  timeMS?: number,
): Flexible<[Optional<A>, Optional<B>, Optional<C>, Optional<D>]>;
export function throttle(...args: unknown[]): Flexible<unknown> {
  const argsLength = args.length;
  if (argsLength < 2) return getCombinatorError('throttle');

  const timeMS = args.pop();
  const firstArg = args[0];

  if (typeof timeMS !== 'number') return getCombinatorError('throttle');

  if (Array.isArray(firstArg)) {
    if (firstArg.length === 1) {
      return throttleForSingleArg(firstArg[0], timeMS);
    }

    return throttleForArray(firstArg, timeMS);
  }

  if (isFlexibleOrUnit(firstArg) && argsLength === 2) {
    return throttleForSingleArg(firstArg, timeMS);
  }

  if (isFlexibleOrUnitObject(firstArg)) {
    const results: Record<string, Optional<unknown> | unknown> = {};
    const keys = Object.keys(firstArg);

    let timer: NodeJS.Timeout | null = null;
    let lastExecutionTime: number | null = null;

    const throttledFn = (fn: () => void) => {
      const now = Date.now();

      if (lastExecutionTime === null || now - lastExecutionTime >= timeMS) {
        lastExecutionTime = now;

        fn();
      } else {
        if (timer) clearTimeout(timer);

        timer = setTimeout(
          () => {
            lastExecutionTime = Date.now();

            fn();
          },
          timeMS - (now - lastExecutionTime),
        );
      }
    };

    if (keys.length === 1) {
      return new Flexible((subscriber) => {
        const current = get(firstArg[keys[0]]);

        const unsubscribe = current.subscribe((value) => {
          results[keys[0]] = value;

          throttledFn(() => subscriber.next(results));
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

          throttledFn(() => subscriber.next(results));
        });
      });

      return () => {
        subscriber.unsubscribe();
        unsubscribes.forEach((subscription) => subscription.unsubscribe());
      };
    });
  }

  if (args.every((arg) => isFlexibleOrUnit(arg))) {
    return throttleForArray(args as FlexibleOrUnit<unknown>[], timeMS);
  }

  return getCombinatorError('throttle');
}

function throttleForArray(units: FlexibleOrUnit<unknown>[], timeMS: number): Flexible<unknown[]> {
  const results: Optional<unknown>[] = new Array(units.length).fill(Optional.none());

  let timer: NodeJS.Timeout | null = null;
  let lastExecutionTime: number | null = null;

  const throttledFn = (fn: () => void) => {
    const now = Date.now();

    if (lastExecutionTime === null || now - lastExecutionTime >= timeMS) {
      lastExecutionTime = now;

      fn();
    } else {
      if (timer) clearTimeout(timer);

      timer = setTimeout(
        () => {
          lastExecutionTime = Date.now();

          fn();
        },
        timeMS - (now - lastExecutionTime),
      );
    }
  };

  return new Flexible((subscriber) => {
    const unsubscribes = units.map((unit, i) => {
      const current = get(unit);

      return current.subscribe((value) => {
        results[i] = Optional.of(value);

        throttledFn(() => subscriber.next(results));
      });
    });

    return () => {
      if (timer) clearTimeout(timer);
      subscriber.unsubscribe();
      unsubscribes.forEach((subscription) => subscription.unsubscribe());
    };
  });
}

function throttleForSingleArg(arg: FlexibleOrUnit<unknown>, timeMS: number): Flexible<unknown> {
  let timer: NodeJS.Timeout | null = null;
  let lastExecutionTime: number | null = null;

  const throttledFn = (fn: () => void) => {
    const now = Date.now();

    if (lastExecutionTime === null || now - lastExecutionTime >= timeMS) {
      lastExecutionTime = now;

      fn();
    } else {
      if (timer) clearTimeout(timer);

      timer = setTimeout(
        () => {
          lastExecutionTime = Date.now();

          fn();
        },
        timeMS - (now - lastExecutionTime),
      );
    }
  };

  return new Flexible((subscriber) => {
    const current = get(arg);

    const unsubscribe = current.subscribe((value) => {
      throttledFn(() => subscriber.next(value));
    });

    return () => {
      if (timer) clearTimeout(timer);
      subscriber.unsubscribe();
      unsubscribe.unsubscribe();
    };
  });
}
