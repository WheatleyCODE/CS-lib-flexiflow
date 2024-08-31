import {Subscriber} from './Subscriber.ts';
import {Subscription} from './Subscription.ts';
import type {Destroy, Subscribable, Observer} from './types.ts';

export class Flexible<T> implements Subscribable<T> {
  constructor(subscribe?: (this: Flexible<T>, subscriber: Subscriber<T>) => Destroy) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }

  subscribe(observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null): Subscription {
    const subscriber = observerOrNext instanceof Subscriber ? observerOrNext : new Subscriber(observerOrNext);

    subscriber.add(this._trySubscribe(subscriber));

    return subscriber;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _subscribe(_subscriber: Subscriber<any>): Destroy {
    return;
  }

  protected _trySubscribe(subscriber: Subscriber<T>): Destroy {
    try {
      return this._subscribe(subscriber);
    } catch (err) {
      subscriber.error(err);
    }
  }

  [Symbol.Flexible ?? '@@Flexible']() {
    return this;
  }
}
