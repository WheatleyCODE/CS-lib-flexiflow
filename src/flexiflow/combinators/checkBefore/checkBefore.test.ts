import {Optional} from '../../optional';
import {createBooleanStore, createCountStore, createStringStore, TestStore} from '../../tests';
import {checkBefore} from './checkBefore';

describe('checkBefore', () => {
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

  test('checkBefore 1', () => {
    const [$number0, number0Changed] = numberStore0;

    let resultFlexibleArgsPrevValues: unknown[] = [];

    const flexibleArgs = checkBefore($number0, 3, (_, prevValues) => {
      resultFlexibleArgsPrevValues = prevValues;

      return true;
    });

    let resultFlexibleObjPrevValues: unknown[] = [];

    const flexibleObj = checkBefore({a: $number0}, 3, (_, prevValues) => {
      resultFlexibleObjPrevValues = prevValues;

      return true;
    });

    let resultFlexibleArrPrevValues: unknown[] = [];

    const flexibleArr = checkBefore([$number0], 3, (_, prevValues) => {
      resultFlexibleArrPrevValues = prevValues;

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

    number0Changed(); // prev value [0]
    number0Changed(); // prev value [1]
    number0Changed(); // prev value [2]

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed(); // First trigger

    expect(resultFlexibleArgs).toBe(4);
    expect(resultFlexibleObj).toBe(4);
    expect(resultFlexibleArr).toBe(4);

    expect(resultFlexibleArgsPrevValues).toEqual([3, 2, 1]);
    expect(resultFlexibleObjPrevValues).toEqual([{a: 3}, {a: 2}, {a: 1}]);
    expect(resultFlexibleArrPrevValues).toEqual([3, 2, 1]);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('checkBefore 2', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;

    let resultFlexibleArgsPrevValues: Optional<unknown>[][] = [];

    const flexibleArgs = checkBefore($number0, $number1, 3, (_, prevValues) => {
      resultFlexibleArgsPrevValues = prevValues;

      return true;
    });

    let resultFlexibleObjPrevValues: {a: Optional<unknown>; b: Optional<unknown>}[] = [];

    const flexibleObj = checkBefore({a: $number0, b: $number1}, 3, (_, prevValues) => {
      resultFlexibleObjPrevValues = prevValues;

      return true;
    });

    let resultFlexibleArrPrevValues: Optional<unknown>[][] = [];

    const flexibleArr = checkBefore([$number0, $number1], 3, (_, prevValues) => {
      resultFlexibleArrPrevValues = prevValues;

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

    number1Changed(); // prev value [0]
    number0Changed(); // prev value [1]
    number0Changed(); // prev value [2]

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed(); // First trigger

    expect(resultFlexibleArgs).toBe(4);
    expect(resultFlexibleObj).toBe(4);
    expect(resultFlexibleArr).toBe(4);

    expect(resultFlexibleArgsPrevValues.map((arr) => arr.map((opt) => opt.unwrap()))).toEqual([
      [2, 1],
      [1, 1],
      [null, 1],
    ]);

    expect(resultFlexibleObjPrevValues.map((opt) => ({a: opt.a.unwrap(), b: opt.b.unwrap()}))).toEqual([
      {a: 2, b: 1},
      {a: 1, b: 1},
      {a: null, b: 1},
    ]);

    expect(resultFlexibleArrPrevValues.map((arr) => arr.map((opt) => opt.unwrap()))).toEqual([
      [2, 1],
      [1, 1],
      [null, 1],
    ]);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('checkBefore 3', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;

    let resultFlexibleArgsPrevValues: Optional<unknown>[][] = [];

    const flexibleArgs = checkBefore($number0, $number1, $number2, 3, (_, prevValues) => {
      resultFlexibleArgsPrevValues = prevValues;

      return true;
    });

    let resultFlexibleObjPrevValues: {a: Optional<unknown>; b: Optional<unknown>; c: Optional<unknown>}[] = [];

    const flexibleObj = checkBefore({a: $number0, b: $number1, c: $number2}, 3, (_, prevValues) => {
      resultFlexibleObjPrevValues = prevValues;

      return true;
    });

    let resultFlexibleArrPrevValues: Optional<unknown>[][] = [];

    const flexibleArr = checkBefore([$number0, $number1, $number2], 3, (_, prevValues) => {
      resultFlexibleArrPrevValues = prevValues;

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

    number1Changed(); // prev value [0]
    number2Changed(); // prev value [1]
    number0Changed(); // prev value [2]

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed(); // First trigger

    expect(resultFlexibleArgs).toBe(4);
    expect(resultFlexibleObj).toBe(4);
    expect(resultFlexibleArr).toBe(4);

    expect(resultFlexibleArgsPrevValues.map((arr) => arr.map((opt) => opt.unwrap()))).toEqual([
      [1, 1, 1],
      [null, 1, 1],
      [null, 1, null],
    ]);

    expect(resultFlexibleObjPrevValues.map((opt) => ({a: opt.a.unwrap(), b: opt.b.unwrap(), c: opt.c.unwrap()}))).toEqual([
      {a: 1, b: 1, c: 1},
      {a: null, b: 1, c: 1},
      {a: null, b: 1, c: null},
    ]);

    expect(resultFlexibleArrPrevValues.map((arr) => arr.map((opt) => opt.unwrap()))).toEqual([
      [1, 1, 1],
      [null, 1, 1],
      [null, 1, null],
    ]);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('checkBefore 4', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;
    const [$number3, number3Changed] = numberStore3;

    let resultFlexibleArgsPrevValues: Optional<unknown>[][] = [];

    const flexibleArgs = checkBefore($number0, $number1, $number2, $number3, 3, (_, prevValues) => {
      resultFlexibleArgsPrevValues = prevValues;

      return true;
    });

    let resultFlexibleObjPrevValues: {a: Optional<unknown>; b: Optional<unknown>; c: Optional<unknown>; d: Optional<unknown>}[] = [];

    const flexibleObj = checkBefore({a: $number0, b: $number1, c: $number2, d: $number3}, 3, (_, prevValues) => {
      resultFlexibleObjPrevValues = prevValues;

      return true;
    });

    let resultFlexibleArrPrevValues: Optional<unknown>[][] = [];

    const flexibleArr = checkBefore([$number0, $number1, $number2, $number3], 3, (_, prevValues) => {
      resultFlexibleArrPrevValues = prevValues;

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

    number1Changed(); // prev value [0]
    number2Changed(); // prev value [1]
    number3Changed(); // prev value [2]

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed(); // First trigger

    expect(resultFlexibleArgs).toBe(4);
    expect(resultFlexibleObj).toBe(4);
    expect(resultFlexibleArr).toBe(4);

    expect(resultFlexibleArgsPrevValues.map((arr) => arr.map((opt) => opt.unwrap()))).toEqual([
      [null, 1, 1, 1],
      [null, 1, 1, null],
      [null, 1, null, null],
    ]);

    expect(
      resultFlexibleObjPrevValues.map((opt) => ({a: opt.a.unwrap(), b: opt.b.unwrap(), c: opt.c.unwrap(), d: opt.d.unwrap()})),
    ).toEqual([
      {a: null, b: 1, c: 1, d: 1},
      {a: null, b: 1, c: 1, d: null},
      {a: null, b: 1, c: null, d: null},
    ]);

    expect(resultFlexibleArrPrevValues.map((arr) => arr.map((opt) => opt.unwrap()))).toEqual([
      [null, 1, 1, 1],
      [null, 1, 1, null],
      [null, 1, null, null],
    ]);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });
});
