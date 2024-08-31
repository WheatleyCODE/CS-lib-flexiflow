import {Flexible} from '../flexible';
import {FlexibleOrUnit} from '../types';
import {isUnit} from './isUnit';

export function isFlexibleOrUnit(value: unknown): value is FlexibleOrUnit<unknown> {
  return isUnit(value) || value instanceof Flexible;
}
