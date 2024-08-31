import {pipe} from './pipe';

export function pipeFn<UT, A>(ta: (t: UT) => A): (t: UT) => A;
export function pipeFn<UT, A, B>(ta: (t: UT) => A, ab: (a: A) => B): (t: UT) => B;
export function pipeFn<UT, A, B, C>(ta: (t: UT) => A, ab: (a: A) => B, bc: (b: B) => C): (t: UT) => C;
export function pipeFn<UT, A, B, C, D>(ta: (t: UT) => A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (t: UT) => D;
export function pipeFn<UT, A, B, C, D, E>(
  ta: (t: UT) => A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): (t: UT) => E;
export function pipeFn<UT, A, B, C, D, E, F>(
  ta: (t: UT) => A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (d: E) => F,
): (t: UT) => F;
// export function pipeFn<UT, A, B, C, D, E, F>(ta: (t: UT) => A, ab?: (a: A) => B, bc?: (b: B) => C, cd?: (c: C) => D, de?: (d: D) => E, ef?: (d: E) => F): (t: UT) => F {
export function pipeFn(...fns: []): (arg: unknown) => unknown {
  return (arg: unknown) => pipe(arg, ...fns);
}
