import {Flexible} from './Flexible';
import {delay} from '../tests/delay';

const expectSubscriber = (value: any) => {
  expect(typeof value.next).toBe('function');
  expect(typeof value.add).toBe('function');
  expect(typeof value.complete).toBe('function');
  expect(typeof value.error).toBe('function');
  expect(typeof value.isClosed).toBe('boolean');
  expect(typeof value.remove).toBe('function');
  expect(typeof value.unsubscribe).toBe('function');
};

const expectSubscription = (value: any) => {
  expect(typeof value.add).toBe('function');
  expect(typeof value.isClosed).toBe('boolean');
  expect(typeof value.remove).toBe('function');
  expect(typeof value.unsubscribe).toBe('function');
};

describe('Flexible', () => {
  test('RxJS like: Base subscription', () => {
    let canBeSubscriber: any;

    const flexible = new Flexible<number>((subscriber) => {
      canBeSubscriber = subscriber;

      subscriber.next(1);
      subscriber.next(2);
      subscriber.next(3);
    });

    const result: number[] = [];

    const subscription = flexible.subscribe((num) => {
      result.push(num);
    });

    expectSubscription(subscription);
    expectSubscriber(canBeSubscriber);
    expect(result).toEqual([1, 2, 3]);
  });

  test('RxJS like: Complete is handled properly', () => {
    const flexible = new Flexible<number>((subscriber) => {
      subscriber.next(1);
      subscriber.complete();
      subscriber.next(2); // Not be called
    });

    const result: number[] = [];

    const observer = {
      next: (num: number) => result.push(num),
      complete: () => result.push(99),
    };

    const subscription = flexible.subscribe(observer);

    expectSubscription(subscription);
    expect(result).toEqual([1, 99]);
  });

  test('RxJS like: Error is handled properly', () => {
    const flexible = new Flexible<number>((subscriber) => {
      subscriber.next(1);
      subscriber.error(new Error('Something went wrong!'));
      subscriber.next(2);
    });

    const result: number[] = [];

    const observer = {
      next: (num: number) => result.push(num),
      error: (err: any) => result.push(err.message),
    };

    const subscription = flexible.subscribe(observer);

    expectSubscription(subscription);
    expect(result).toEqual([1, 'Something went wrong!']);
  });

  test('RxJS like: Multiple subscribers', () => {
    const flexible = new Flexible<number>((subscriber) => {
      subscriber.next(1);
      subscriber.next(2);
    });

    const result1: number[] = [];
    const result2: number[] = [];

    const subscription1 = flexible.subscribe((num) => {
      result1.push(num);
    });

    const subscription2 = flexible.subscribe((num) => {
      result2.push(num);
    });

    expectSubscription(subscription1);
    expectSubscription(subscription2);

    expect(result1).toEqual([1, 2]);
    expect(result2).toEqual([1, 2]);
  });

  test('RxJS like: Unsubscribe stops receiving notifications', () => {
    const flexible = new Flexible<number>((subscriber) => {
      subscriber.next(1);
      subscriber.next(2);
    });

    let result: number[] = [];

    const subscription = flexible.subscribe((num) => {
      result.push(num);
    });

    result = [];

    subscription.unsubscribe();

    expectSubscription(subscription);

    const newSubscription = flexible.subscribe((num) => {
      result.push(num);
    });

    expectSubscription(newSubscription);
    expect(result).toEqual([1, 2]);
  });

  test('RxJS like: Support for delayed next calls', async () => {
    const flexible = new Flexible<number>((subscriber) => {
      setTimeout(() => subscriber.next(1), 100);
      setTimeout(() => subscriber.next(2), 200);
      setTimeout(() => subscriber.complete(), 300);
    });

    const result: number[] = [];

    const observer = {
      next: (num: number) => result.push(num),
      complete: () => {
        result.push(99);
      },
    };

    const subscription = flexible.subscribe(observer);

    await delay(500);

    expectSubscription(subscription);
    expect(result).toEqual([1, 2, 99]);
  });
});
