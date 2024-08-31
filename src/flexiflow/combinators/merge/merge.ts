import {Flexible} from '../../flexible';
import {FlexibleOrUnit, ObjectFlexibleOrUnitValues} from '../../types';
import {isFlexibleOrUnit} from '../../utils/isFlexibleOrUnit';
import {isFlexibleOrUnitObject} from '../../utils/isFlexibleOrUnitObject';
import {get} from '../get';
import {getCombinatorError} from '../getCombinatorError';

export function merge<A>(args: FlexibleOrUnit<A>): Flexible<A>;
export function merge<A extends Record<string, FlexibleOrUnit<unknown>>>(args: A): Flexible<ObjectFlexibleOrUnitValues<A>>;
export function merge<A>(args: [FlexibleOrUnit<A>]): Flexible<A>;
export function merge<A, B>(args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>]): Flexible<A | B>;
export function merge<A, B, C>(args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>]): Flexible<A | B | C>;
export function merge<A, B, C, D>(
  args: [FlexibleOrUnit<A>, FlexibleOrUnit<B>, FlexibleOrUnit<C>, FlexibleOrUnit<D>],
): Flexible<A | B | C | D>;
export function merge<A, B>(a: FlexibleOrUnit<A>, b?: FlexibleOrUnit<B>): Flexible<A | B>;
export function merge<A, B, C>(a: FlexibleOrUnit<A>, b?: FlexibleOrUnit<B>, c?: FlexibleOrUnit<C>): Flexible<A | B | C>;
export function merge<A, B, C, D>(
  a: FlexibleOrUnit<A>,
  b?: FlexibleOrUnit<B>,
  c?: FlexibleOrUnit<C>,
  d?: FlexibleOrUnit<D>,
): Flexible<A | B | C | D>;
export function merge(...args: unknown[]): Flexible<unknown> {
  const argsLength = args.length;
  if (argsLength < 1) return getCombinatorError('merge');

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
    return new Flexible((subscriber) => {
      const keys = Object.keys(firstArg);

      const unsubscribes = keys.map((key) => {
        const current = get(firstArg[key]);

        return current.subscribe((value) => {
          subscriber.next(value);
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

  return getCombinatorError('merge');
}

function seqForArray(units: FlexibleOrUnit<unknown>[]): Flexible<unknown> {
  return new Flexible((subscriber) => {
    const unsubscribes = units.map((unit) => {
      const current = get(unit);

      return current.subscribe((value) => {
        subscriber.next(value);
      });
    });

    return () => {
      subscriber.unsubscribe();
      unsubscribes.forEach((subscription) => subscription.unsubscribe());
    };
  });
}
