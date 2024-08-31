import {Optional} from '../../optional';
import {createBooleanStore, createCountStore, createStringStore, TestStore} from '../../tests';
import {checkAfter} from './checkAfter';

describe('checkAfter', () => {
  let isWorkArgs = false;
  let isWorkObj = false;
  let isWorkArr = false;

  let booleanStore0: TestStore<boolean> = [] as any;

  let numberStore0: TestStore<number> = [] as any;
  let numberStore1: TestStore<number> = [] as any;
  let numberStore2: TestStore<number> = [] as any;
  let numberStore3: TestStore<number> = [] as any;

  let stringStore0: TestStore<string> = [] as any;
  let stringStore1: TestStore<string> = [] as any;
  let stringStore2: TestStore<string> = [] as any;
  let stringStore3: TestStore<string> = [] as any;

  console.log({
    isWorkArgs,
    isWorkObj,
    isWorkArr,
    booleanStore0,
    numberStore0,
    numberStore1,
    numberStore2,
    numberStore3,
    stringStore0,
    stringStore1,
    stringStore2,
    stringStore3,
  });

  beforeEach(() => {
    isWorkArgs = false;
    isWorkObj = false;
    isWorkArr = false;

    booleanStore0 = createBooleanStore();

    numberStore0 = createCountStore();
    numberStore1 = createCountStore();
    numberStore2 = createCountStore();
    numberStore3 = createCountStore();

    stringStore0 = createStringStore();
    stringStore1 = createStringStore();
    stringStore2 = createStringStore();
    stringStore3 = createStringStore();
  });

  test('checkAfter 1', () => {
    const [$number0, number0Changed] = numberStore0;

    let resultFlexibleArgsFutureValues: unknown[] = [];

    const flexibleArgs = checkAfter($number0, 3, (_, futureValues) => {
      resultFlexibleArgsFutureValues = futureValues;

      return true;
    });

    let resultFlexibleObjFutureValues: unknown[] = [];

    const flexibleObj = checkAfter({a: $number0}, 3, (_, futureValues) => {
      resultFlexibleObjFutureValues = futureValues;

      return true;
    });

    let resultFlexibleArrFutureValues: unknown[] = [];

    const flexibleArr = checkAfter([$number0], 3, (_, futureValues) => {
      resultFlexibleArrFutureValues = futureValues;

      return true;
    });

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe((number) => {
      isWorkArgs = true;
      resultFlexibleArgs = number;
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe(({a}) => {
      isWorkObj = true;
      resultFlexibleObj = a;
    });

    let resultFlexibleArr = 0;

    flexibleArr.subscribe((number) => {
      isWorkArr = true;
      resultFlexibleArr = number;
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed(); // first value

    number0Changed(); // future value [0]
    number0Changed(); // future value [1]
    number0Changed(); // future value [2]

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed(); // First trigger

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    expect(resultFlexibleArgsFutureValues).toEqual([2, 3, 4]);
    expect(resultFlexibleObjFutureValues).toEqual([{a: 2}, {a: 3}, {a: 4}]);
    expect(resultFlexibleArrFutureValues).toEqual([2, 3, 4]);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('checkAfter 2', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;

    let resultFlexibleArgsFutureValues: Optional<unknown>[][] = [];

    const flexibleArgs = checkAfter($number0, $number1, 3, (_, futureValues) => {
      resultFlexibleArgsFutureValues = futureValues;

      return true;
    });

    let resultFlexibleObjFutureValues: {a: Optional<unknown>; b: Optional<unknown>}[] = [];

    const flexibleObj = checkAfter({a: $number0, b: $number1}, 3, (_, futureValues) => {
      resultFlexibleObjFutureValues = futureValues;

      return true;
    });

    let resultFlexibleArrFutureValues: Optional<unknown>[][] = [];

    const flexibleArr = checkAfter([$number0, $number1], 3, (_, futureValues) => {
      resultFlexibleArrFutureValues = futureValues;

      return true;
    });

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe(([a, b]) => {
      isWorkArgs = true;
      resultFlexibleArgs = a.getOrElse(0) + b.getOrElse(0);
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe(({a, b}) => {
      isWorkObj = true;
      resultFlexibleObj = a.getOrElse(0) + b.getOrElse(0);
    });

    let resultFlexibleArr = 0;

    flexibleArr.subscribe(([a, b]) => {
      isWorkArr = true;
      resultFlexibleArr = a.getOrElse(0) + b.getOrElse(0);
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number1Changed(); // first value

    number0Changed(); // future value [0]
    number0Changed(); // future value [1]
    number0Changed(); // future value [2]

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed(); // First trigger

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    expect(resultFlexibleArgsFutureValues.map((arr) => arr.map((opt) => opt.unwrap()))).toEqual([
      [1, 1],
      [2, 1],
      [3, 1],
    ]);

    expect(resultFlexibleObjFutureValues.map((opt) => ({a: opt.a.unwrap(), b: opt.b.unwrap()}))).toEqual([
      {a: 1, b: 1},
      {a: 2, b: 1},
      {a: 3, b: 1},
    ]);

    expect(resultFlexibleArrFutureValues.map((arr) => arr.map((opt) => opt.unwrap()))).toEqual([
      [1, 1],
      [2, 1],
      [3, 1],
    ]);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('checkAfter 3', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;

    let resultFlexibleArgsFutureValues: Optional<unknown>[][] = [];

    const flexibleArgs = checkAfter($number0, $number1, $number2, 3, (_, futureValues) => {
      resultFlexibleArgsFutureValues = futureValues;

      return true;
    });

    let resultFlexibleObjFutureValues: {a: Optional<unknown>; b: Optional<unknown>; c: Optional<unknown>}[] = [];

    const flexibleObj = checkAfter({a: $number0, b: $number1, c: $number2}, 3, (_, futureValues) => {
      resultFlexibleObjFutureValues = futureValues;

      return true;
    });

    let resultFlexibleArrFutureValues: Optional<unknown>[][] = [];

    const flexibleArr = checkAfter([$number0, $number1, $number2], 3, (_, futureValues) => {
      resultFlexibleArrFutureValues = futureValues;

      return true;
    });

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe(([a, b, c]) => {
      isWorkArgs = true;
      resultFlexibleArgs = a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0);
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe(({a, b, c}) => {
      isWorkObj = true;
      resultFlexibleObj = a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0);
    });

    let resultFlexibleArr = 0;

    flexibleArr.subscribe(([a, b, c]) => {
      isWorkArr = true;
      resultFlexibleArr = a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0);
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number1Changed(); // first value

    number2Changed(); // future value [0]

    number0Changed(); // future value [1]
    number0Changed(); // future value [2]

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed(); // First trigger

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    expect(resultFlexibleArgsFutureValues.map((arr) => arr.map((opt) => opt.unwrap()))).toEqual([
      [null, 1, 1],
      [1, 1, 1],
      [2, 1, 1],
    ]);

    expect(resultFlexibleObjFutureValues.map((opt) => ({a: opt.a.unwrap(), b: opt.b.unwrap(), c: opt.c.unwrap()}))).toEqual([
      {a: null, b: 1, c: 1},
      {a: 1, b: 1, c: 1},
      {a: 2, b: 1, c: 1},
    ]);

    expect(resultFlexibleArrFutureValues.map((arr) => arr.map((opt) => opt.unwrap()))).toEqual([
      [null, 1, 1],
      [1, 1, 1],
      [2, 1, 1],
    ]);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('checkAfter 4', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;
    const [$number3, number3Changed] = numberStore3;

    let resultFlexibleArgsFutureValues: Optional<unknown>[][] = [];

    const flexibleArgs = checkAfter($number0, $number1, $number2, $number3, 3, (_, futureValues) => {
      resultFlexibleArgsFutureValues = futureValues;

      return true;
    });

    let resultFlexibleObjFutureValues: {a: Optional<unknown>; b: Optional<unknown>; c: Optional<unknown>; d: Optional<unknown>}[] = [];

    const flexibleObj = checkAfter({a: $number0, b: $number1, c: $number2, d: $number3}, 3, (_, futureValues) => {
      resultFlexibleObjFutureValues = futureValues;

      return true;
    });

    let resultFlexibleArrFutureValues: Optional<unknown>[][] = [];

    const flexibleArr = checkAfter([$number0, $number1, $number2, $number3], 3, (_, futureValues) => {
      resultFlexibleArrFutureValues = futureValues;

      return true;
    });

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe(([a, b, c, d]) => {
      isWorkArgs = true;
      resultFlexibleArgs = a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0) + d.getOrElse(0);
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe(({a, b, c, d}) => {
      isWorkObj = true;
      resultFlexibleObj = a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0) + d.getOrElse(0);
    });

    let resultFlexibleArr = 0;

    flexibleArr.subscribe(([a, b, c, d]) => {
      isWorkArr = true;
      resultFlexibleArr = a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0) + d.getOrElse(0);
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number1Changed(); // first value

    number2Changed(); // future value [0]

    number3Changed(); // future value [1]

    number0Changed(); // future value [2]

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed(); // First trigger

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    expect(resultFlexibleArgsFutureValues.map((arr) => arr.map((opt) => opt.unwrap()))).toEqual([
      [null, 1, 1, null],
      [null, 1, 1, 1],
      [1, 1, 1, 1],
    ]);

    expect(
      resultFlexibleObjFutureValues.map((opt) => ({a: opt.a.unwrap(), b: opt.b.unwrap(), c: opt.c.unwrap(), d: opt.d.unwrap()})),
    ).toEqual([
      {a: null, b: 1, c: 1, d: null},
      {a: null, b: 1, c: 1, d: 1},
      {a: 1, b: 1, c: 1, d: 1},
    ]);

    expect(resultFlexibleArrFutureValues.map((arr) => arr.map((opt) => opt.unwrap()))).toEqual([
      [null, 1, 1, null],
      [null, 1, 1, 1],
      [1, 1, 1, 1],
    ]);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });
});
