import {CompleteNotification, ErrorNotification, NextNotification, NotificationTypes} from './types';

export const COMPLETE_NOTIFICATION = (() => createNotification('C', undefined, undefined) as CompleteNotification)();

export function nextNotification<T>(value: T) {
  return createNotification('N', value, undefined) as NextNotification<T>;
}

export function errorNotification(error: unknown): ErrorNotification {
  return createNotification('E', undefined, error) as ErrorNotification;
}

export function createNotification<T>(kind: 'N', value: T, error: undefined): {kind: 'N'; value: T; error: undefined};
export function createNotification(kind: 'E', value: undefined, error: unknown): {kind: 'E'; value: undefined; error: unknown};
export function createNotification(kind: 'C', value: undefined, error: undefined): {kind: 'C'; value: undefined; error: undefined};
export function createNotification<T>(
  kind: NotificationTypes,
  value: T | undefined,
  error: unknown,
): {kind: NotificationTypes; value: T | undefined; error: unknown};
export function createNotification<T>(kind: NotificationTypes, value: T | undefined, error: unknown) {
  return {
    kind,
    value,
    error,
  };
}
