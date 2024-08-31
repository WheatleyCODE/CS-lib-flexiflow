/* eslint-disable @typescript-eslint/no-explicit-any */
export function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === 'function';
}
