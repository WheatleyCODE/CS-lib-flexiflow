import {isFunction} from '../utils/isFunction';
import {config} from './constants';
import {COMPLETE_NOTIFICATION, errorNotification, nextNotification} from './notifications';
import {Subscription} from './Subscription';
import {FlexibleNotification, Observer, OperateConfig, SubscriberOverrides} from './types';

export class Subscriber<T> extends Subscription implements Observer<T> {
  protected isStopped: boolean = false;
  protected destination: Observer<T>;

  protected readonly nextOverride: ((value: T) => void) | null = null;
  protected readonly errorOverride: ((err: unknown) => void) | null = null;
  protected readonly completeOverride: (() => void) | null = null;
  protected readonly onFinalize: (() => void) | null = null;

  constructor(destination?: Subscriber<T> | Partial<Observer<T>> | ((value: T) => void) | null);
  constructor(
    destination: Subscriber<unknown> | Partial<Observer<any>> | ((value: unknown) => void) | null,
    overrides: SubscriberOverrides<T>,
  );
  constructor(destination?: Subscriber<T> | Partial<Observer<T>> | ((value: T) => void) | null, overrides?: SubscriberOverrides<T>) {
    super();

    this.destination = destination instanceof Subscriber ? destination : createSafeObserver(destination);

    this.nextOverride = overrides?.next ?? null;
    this.errorOverride = overrides?.error ?? null;
    this.completeOverride = overrides?.complete ?? null;
    this.onFinalize = overrides?.finalize ?? null;

    this._next = this.nextOverride ? overrideNext : this._next;
    this._error = this.errorOverride ? overrideError : this._error;
    this._complete = this.completeOverride ? overrideComplete : this._complete;

    if (isUnsubscribeAndAdd(destination)) {
      destination.add(this);
    }
  }

  next(value: T): void {
    if (this.isStopped) {
      handleStoppedNotification(nextNotification(value), this);
    } else {
      this._next(value!);
    }
  }

  error(err?: unknown): void {
    if (this.isStopped) {
      handleStoppedNotification(errorNotification(err), this);
    } else {
      this.isStopped = true;
      this._error(err);
    }
  }

  complete(): void {
    if (this.isStopped) {
      handleStoppedNotification(COMPLETE_NOTIFICATION, this);
    } else {
      this.isStopped = true;
      this._complete();
    }
  }

  unsubscribe(): void {
    if (!this.isClosed) {
      this.isStopped = true;

      super.unsubscribe();
      this.onFinalize?.();
    }
  }

  protected _next(value: T): void {
    this.destination.next(value);
  }

  protected _error(err: unknown): void {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  }

  protected _complete(): void {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  }
}

function overrideNext<T>(this: Subscriber<T>, value: T): void {
  try {
    this.nextOverride!(value);
  } catch (error) {
    this.destination.error(error);
  }
}

function overrideError(this: Subscriber<unknown>, err: unknown): void {
  try {
    this.errorOverride!(err);
  } catch (error) {
    this.destination.error(error);
  } finally {
    this.unsubscribe();
  }
}

function overrideComplete(this: Subscriber<unknown>): void {
  try {
    this.completeOverride!();
  } catch (error) {
    this.destination.error(error);
  } finally {
    this.unsubscribe();
  }
}

function createSafeObserver<T>(observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | null): Observer<T> {
  return new ConsumerObserver(!observerOrNext || isFunction(observerOrNext) ? {next: observerOrNext ?? undefined} : observerOrNext);
}

function handleStoppedNotification(notification: FlexibleNotification<unknown>, subscriber: Subscriber<any>) {
  const {onStoppedNotification} = config;

  onStoppedNotification && setTimeout(() => onStoppedNotification(notification, subscriber));
}

function isUnsubscribeAndAdd(value: any): value is Subscription {
  return value && isFunction(value.unsubscribe) && isFunction(value.add);
}

export function operate<In, Out>({destination, ...subscriberOverrides}: OperateConfig<In, Out>) {
  return new Subscriber(destination, subscriberOverrides);
}

class ConsumerObserver<T> implements Observer<T> {
  constructor(private partialObserver: Partial<Observer<T>>) {}

  next(value: T): void {
    if (this.partialObserver.next) {
      try {
        this.partialObserver.next(value);
      } catch (error) {
        reportUnhandledError(error);
      }
    }
  }

  error(err: unknown): void {
    if (this.partialObserver.error) {
      try {
        this.partialObserver.error(err);
      } catch (error) {
        reportUnhandledError(error);
      }
    } else {
      reportUnhandledError(err);
    }
  }

  complete(): void {
    if (this.partialObserver.complete) {
      try {
        this.partialObserver.complete();
      } catch (error) {
        reportUnhandledError(error);
      }
    }
  }
}

export function reportUnhandledError(err: unknown) {
  setTimeout(() => {
    const {onUnhandledError} = config;

    if (onUnhandledError) {
      onUnhandledError(err);
    } else {
      throw err;
    }
  });
}
