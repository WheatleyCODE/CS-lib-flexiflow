/* eslint-disable @typescript-eslint/ban-ts-comment */
import {SyncPromise} from './syncPromise';

describe('SyncPromise', () => {
  test('SyncPromise behavior is the same as regular Promise', async () => {
    let promiseRes;
    let syncPromiseRes;

    await Promise.reject('a')
      .then(
        (p) => p + '1',
        (p) => p + '2', // a2
      )
      .catch((p) => p + 'b')
      .catch((p) => p + 'c')
      .then((p) => p + 'd1') // a2d1
      // @ts-ignore
      .then('d2')
      .then((p) => p + 'd3') // a2d1d3
      // @ts-ignore
      .finally((p) => p + 'e')
      .then((p) => (promiseRes = p));

    await SyncPromise.reject('a')
      .then(
        (p) => p + '1',
        (p) => p + '2', // a2
      )
      .catch((p) => p + 'b')
      .catch((p) => p + 'c')
      .then((p) => p + 'd1') // a2d1
      // @ts-ignore
      .then('d2')
      .then((p) => p + 'd3') // a2d1d3
      // @ts-ignore
      .finally((p) => p + 'e')
      .then((p) => (syncPromiseRes = p));

    expect(syncPromiseRes).toBe(promiseRes); // a2d1d3 === a2d1d3
  });

  test('SyncPromise works', () => {
    const promise = new SyncPromise<number>((resolve) => resolve(42));

    let finallyIsCall = false;
    let catchIsCall = false;
    let result = 0;

    promise
      .then((value) => value + 100)
      .then((value) => value + 10)
      .then((value) => {
        result = value - 2;
        return value - 2;
      })
      .catch(() => {
        catchIsCall = true;
      })
      .finally(() => {
        finallyIsCall = true;
      });

    expect(promise[Symbol.toStringTag]).toBe('SyncPromise');
    expect(result).toBe(150);
    expect(catchIsCall).toBe(false);
    expect(finallyIsCall).toBe(true);
  });

  test('SyncPromise error', () => {
    const promise = new SyncPromise<number>((resolve) => resolve(42));

    let finallyIsCall = false;
    let catchIsCall = false;
    let result = 0;

    promise
      .then((value) => value + 100)
      .then((value) => value + 10)
      .then((value) => {
        result = value - 2;
        return value - 2;
      })
      .then(() => {
        // @ts-ignore
        document.blabla();
        result = 0;
      })
      .catch(() => {
        catchIsCall = true;
      })
      .finally(() => {
        finallyIsCall = true;
      });

    expect(promise[Symbol.toStringTag]).toBe('SyncPromise');
    expect(result).toBe(150);
    expect(catchIsCall).toBe(true);
    expect(finallyIsCall).toBe(true);
  });

  test('SyncPromise.resolve', () => {
    let i = 0;
    let j = 0;

    SyncPromise.resolve(1)
      .then((val) => (i = val + 2))
      .then((val) => (i = val * 2));

    SyncPromise.resolve(SyncPromise.resolve(1))
      .then((val) => (j = val + 2))
      .then((val) => (j = val * 2));

    expect(i).toBe(6);
    expect(j).toBe(6);
  });

  test('SyncPromise.reject', () => {
    let i = 1;

    SyncPromise.reject('error').catch((err) => {
      expect(err).toBe('error');
      i += 2;
    });

    expect(i).toBe(3);
  });
});
