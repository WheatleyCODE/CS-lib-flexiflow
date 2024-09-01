import {Subscriber} from './Subscriber';
import {Subscription} from './Subscription';

export interface Unsubscribable {
  unsubscribe(): void;
}

export type Destroy = Subscription | Unsubscribable | (() => void) | void;

export interface SubscriptionLike extends Unsubscribable {
  unsubscribe(): void;
  readonly isClosed: boolean;
}

export interface Subscribable<T> {
  subscribe(observer: Partial<Observer<T>>): Unsubscribable;
}

export interface InteropFlexible<T> {
  [Symbol.Flexible]: () => Subscribable<T>;
}

export interface NextNotification<T> {
  kind: 'N';
  value: T;
}

export interface ErrorNotification {
  kind: 'E';
  error: any;
}

export interface CompleteNotification {
  kind: 'C';
}

export type FlexibleNotification<T> = NextNotification<T> | ErrorNotification | CompleteNotification;

export interface Observer<T> {
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;
}

export interface GlobalConfig {
  onUnhandledError: ((err: any) => void) | null;
  onStoppedNotification: ((notification: FlexibleNotification<any>, subscriber: Subscriber<any>) => void) | null;
}

export interface OperateConfig<In, Out> extends SubscriberOverrides<In> {
  destination: Subscriber<Out>;
}

declare global {
  interface SymbolConstructor {
    readonly dispose: unique symbol;
    readonly Flexible: symbol;
  }
}

export type NotificationTypes = 'N' | 'E' | 'C';

export interface SubscriberOverrides<T> {
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
  finalize?: () => void;
}
