import {Flexible} from '../flexible';
import {FlexibleOrUnit} from '../types';
import {isUnit} from './isUnit';

export function isFlexibleOrUnitObject(value: any): value is Record<string, FlexibleOrUnit<unknown>> {
  if (value && typeof value === 'object') {
    return Object.values(value).every((val) => isUnit(val) || val instanceof Flexible);
  }

  return false;
}
