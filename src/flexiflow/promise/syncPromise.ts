import {isPromiseLike} from '../utils/isPromiseLike';
import {
  AnyOneArgFunction,
  InitRejectHandler,
  InitResolveHandler,
  Executor,
  Nullable,
  PromiseState,
  RejectHandler,
  ResolveHandler,
  Value,
} from './types';

const noop = () => undefined;

export class SyncPromise<T> implements Promise<T> {
  #state: PromiseState = 'pending';

  #initResolveHandler: InitResolveHandler<T>[] = [];
  #rejectHandlers: InitRejectHandler[] = [];

  #value: any;

  [Symbol.toStringTag] = 'SyncPromise';

  constructor(executor: Executor<T>) {
    const clear = () => {
      this.#initResolveHandler = [];
      this.#rejectHandlers = [];
    };

    const reject = (err: any) => {
      if (!this.isPending) return;

      this.#value = err;
      this.#state = 'rejected';

      for (let o = this.#rejectHandlers, i = 0; i < o.length; i++) {
        o[i](err);
      }

      queueMicrotask(() => {
        if (this.#rejectHandlers.length === 0) {
          Promise.reject(err);
        }

        clear();
      });
    };

    const resolve = (value: T) => {
      if (!this.isPending || this.#value != null) return;

      this.#value = value;

      if (isPromiseLike(value)) {
        value.then(forceResolve, reject);
        return;
      }

      this.#state = 'fulfilled';

      for (let o = this.#initResolveHandler, i = 0; i < o.length; i++) {
        o[i](value);
      }

      clear();
    };

    const forceResolve = (value: any) => {
      this.#value = undefined;
      resolve(value);
    };

    this.call(executor, [resolve, reject], reject);
  }

  get isPending() {
    return this.#state === 'pending';
  }

  then<TResult1 = T, TResult2 = never>(
    fulfilled?: Nullable<(value: T) => TResult1 | PromiseLike<TResult1>>,
    rejected?: Nullable<(reason: any) => TResult2 | PromiseLike<TResult2>>,
  ): Promise<TResult1 | TResult2>;
  then(fulfilled?: Nullable<ResolveHandler<T>>, rejected?: Nullable<RejectHandler<T>>): SyncPromise<T> {
    return new SyncPromise<T>((resolve, reject) => {
      const fulfillWrapper = (value?: Value) => {
        this.call(fulfilled ?? resolve, [value], reject, resolve);
      };

      const rejectWrapper = (err: any) => {
        this.call(rejected ?? reject, [err], reject, resolve);
      };

      this.#initResolveHandler.push(fulfillWrapper);
      this.#rejectHandlers.push(rejectWrapper);

      if (!this.isPending) {
        (this.#state === 'fulfilled' ? fulfillWrapper : rejectWrapper)(this.#value);
      }
    });
  }

  catch<R>(rejected: RejectHandler<R>): SyncPromise<R>;
  catch(rejected?: Nullable<RejectHandler<T>>): SyncPromise<T>;
  catch(rejected?: Nullable<RejectHandler<T>>): SyncPromise<T> {
    return new SyncPromise((resolve, reject) => {
      const rejectWrapper = (err: any) => {
        this.call(rejected ?? reject, [err], reject, resolve);
      };

      this.#initResolveHandler.push(resolve);
      this.#rejectHandlers.push(rejectWrapper);

      if (!this.isPending) {
        (this.#state === 'fulfilled' ? resolve : rejectWrapper)(this.#value);
      }
    });
  }

  finally(cb?: Nullable<Function>): SyncPromise<T> {
    return new SyncPromise((resolve, reject) => {
      const fulfillWrapper = () => {
        try {
          let res = cb?.();

          if (isPromiseLike(res)) {
            res = res.then(() => this.#value);
          } else {
            res = this.#value;
          }

          resolve(res);
        } catch (err) {
          reject(err);
        }
      };

      const rejectWrapper = () => {
        try {
          let res = cb?.();

          if (isPromiseLike(res)) {
            res = res.then(() => this.#value);
            resolve(res);
          } else {
            reject(this.#value);
          }
        } catch (err) {
          reject(err);
        }
      };

      this.#initResolveHandler.push(fulfillWrapper);
      this.#rejectHandlers.push(rejectWrapper);

      if (!this.isPending) {
        (this.#state === 'fulfilled' ? fulfillWrapper : rejectWrapper)();
      }
    });
  }

  call<A = unknown, V = unknown>(fn: Nullable<Function>, args?: A[], onError?: InitRejectHandler, onValue?: AnyOneArgFunction<V>): void {
    const reject = onError ?? noop;
    const resolve = onValue ?? noop;

    try {
      if (fn && typeof fn !== 'function') {
        resolve(this.#value);
      }

      const res = fn && args ? fn(...args) : fn?.();

      if (isPromiseLike(res)) {
        res.then(resolve as any, reject);
      } else {
        resolve(res);
      }
    } catch (err) {
      reject(err);
    }
  }

  unwrap(): T {
    if (this.#state !== 'fulfilled') {
      if (this.isPending) {
        throw new Error('Нельзя раскрыть не завершенный SyncPromise');
      }

      if (this.#rejectHandlers.length === 0) {
        this.#rejectHandlers.push(() => {});
      }

      throw this.#value;
    }

    return this.#value;
  }

  static resolve<T = unknown>(value?: Value<T>): SyncPromise<T> {
    if (value instanceof SyncPromise) {
      return value;
    }

    return new SyncPromise((resolve) => resolve(value));
  }

  static reject<T = never>(reason?: unknown): SyncPromise<T> {
    return new SyncPromise((_, reject) => reject(reason));
  }

  static all<T extends any[] | []>(
    values: T,
  ): SyncPromise<{
    [K in keyof T]: Awaited<T[K]>;
  }>;
  static all<T extends Iterable<Value>>(values: T): SyncPromise<Array<T extends Iterable<Value<infer V>> ? V : unknown>> {
    return new SyncPromise((resolve, reject) => {
      const promises = [];

      for (const el of values) {
        promises.push(SyncPromise.resolve(el));
      }

      if (promises.length === 0) {
        resolve([]);
        return;
      }

      const results = new Array(promises.length);
      let done = 0;

      for (let i = 0; i < promises.length; i++) {
        const fulfilled = (value: any) => {
          done++;
          results[i] = value;

          if (done === promises.length) {
            resolve(results);
          }
        };

        promises[i].then(fulfilled, reject);
      }
    });
  }

  static allSettled<T extends any[] | []>(
    values: T,
  ): SyncPromise<{
    [K in keyof T]: PromiseSettledResult<Awaited<T[K]>>;
  }>;
  static allSettled<T extends Iterable<Value>>(
    values: T,
  ): SyncPromise<Array<T extends Iterable<Value<infer V>> ? PromiseSettledResult<V> : PromiseSettledResult<unknown>>> {
    return new SyncPromise((resolve) => {
      const promises = [];

      for (const el of values) {
        promises.push(SyncPromise.resolve(el));
      }

      if (promises.length === 0) {
        resolve([]);
        return;
      }

      const results = new Array(promises.length);
      let done = 0;

      for (let i = 0; i < promises.length; i++) {
        const fulfilled = (value: any) => {
          done++;

          results[i] = {
            status: 'fulfilled',
            value,
          };

          if (done === promises.length) {
            resolve(results);
          }
        };

        const rejected = (reason: any) => {
          done++;

          results[i] = {
            status: 'rejected',
            reason,
          };

          if (done === promises.length) {
            resolve(results);
          }
        };

        promises[i].then(fulfilled, rejected);
      }
    });
  }

  static race<T extends Iterable<Value>>(values: T): SyncPromise<T extends Iterable<Value<infer V>> ? V : unknown> {
    return new SyncPromise((resolve, reject) => {
      const promises: SyncPromise<any>[] = [];

      for (const el of values) {
        promises.push(SyncPromise.resolve(el));
      }

      if (promises.length === 0) {
        resolve();
        return;
      }

      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, reject);
      }
    });
  }

  static any<T extends Iterable<Value>>(values: T): SyncPromise<T extends Iterable<Value<infer V>> ? V : unknown> {
    return new SyncPromise((resolve, reject) => {
      const promises: SyncPromise<any>[] = [];

      for (const el of values) {
        promises.push(SyncPromise.resolve(el));
      }

      if (promises.length === 0) {
        resolve();
        return;
      }

      const errors: any[] = [];

      const onReject = (err: any) => {
        errors.push(err);

        if (errors.length === promises.length) {
          reject(new Error(`Не один SyncPromise не был выполнен успешно: ${JSON.stringify(errors)}`));
        }
      };

      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, onReject);
      }
    });
  }

  static withResolvers<T>(): {
    resolve: InitResolveHandler<T>;
    reject: InitRejectHandler;
    promise: SyncPromise<T>;
  } {
    let resolve: InitResolveHandler<T> = noop;
    let reject: InitRejectHandler = noop;

    const promise = new SyncPromise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    return {resolve, reject, promise};
  }
}
