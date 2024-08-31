import {Flexible} from '../../flexible';
import {FlexibleOrUnit} from '../../types';
import {createWatch} from 'effector';

export function get<T>(unit: FlexibleOrUnit<T>): Flexible<T> {
  if (unit instanceof Flexible) {
    return unit;
  }

  return new Flexible((subscriber) => {
    const fn = (value: T) => {
      subscriber.next(value);
    };

    const unsubscribe = createWatch({unit, fn});

    return () => {
      unsubscribe();
      subscriber.unsubscribe();
    };
  });
}
