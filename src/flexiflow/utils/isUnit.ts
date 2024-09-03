import {Unit} from 'effector';

export function isUnit(value: any): value is Unit<unknown> {
  return !!value?.kind && (value.kind === 'store' || value.kind === 'effect' || value.kind === 'event');
}
