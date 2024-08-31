import {createBooleanStore, createCountStore, createStringStore, TestStore} from '../../tests';
import {watch} from './watch';

describe('watch', () => {
  let isWorkArgs = false;
  let isWorkObj = false;
  let isWorkArr = false;

  let argsWatchCount = 0;
  let objWatchCount = 0;
  let arrWatchCount = 0;

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

    argsWatchCount = 0;
    objWatchCount = 0;
    arrWatchCount = 0;

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

  test('watch 1', () => {
    const [$number0, number0Changed] = numberStore0;

    const flexibleArgs = watch($number0, () => argsWatchCount++);
    const flexibleObj = watch({a: $number0}, () => objWatchCount++);
    const flexibleArr = watch([$number0], () => arrWatchCount++);

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

    number0Changed();

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);

    expect(argsWatchCount).toBe(1);
    expect(objWatchCount).toBe(1);
    expect(argsWatchCount).toBe(1);
  });

  test('watch 2', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;

    const flexibleArgs = watch($number0, $number1, () => argsWatchCount++);
    const flexibleObj = watch({a: $number0, b: $number1}, () => objWatchCount++);
    const flexibleArr = watch([$number0, $number1], () => arrWatchCount++);

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

    number0Changed();
    number1Changed();

    expect(resultFlexibleArgs).toBe(2);
    expect(resultFlexibleObj).toBe(2);
    expect(resultFlexibleArr).toBe(2);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);

    expect(argsWatchCount).toBe(2);
    expect(objWatchCount).toBe(2);
    expect(argsWatchCount).toBe(2);
  });

  test('watch 3', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;

    const flexibleArgs = watch($number0, $number1, $number2, () => argsWatchCount++);
    const flexibleObj = watch({a: $number0, b: $number1, c: $number2}, () => objWatchCount++);
    const flexibleArr = watch([$number0, $number1, $number2], () => arrWatchCount++);

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

    number0Changed();
    number1Changed();
    number2Changed();

    expect(resultFlexibleArgs).toBe(3);
    expect(resultFlexibleObj).toBe(3);
    expect(resultFlexibleArr).toBe(3);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);

    expect(argsWatchCount).toBe(3);
    expect(objWatchCount).toBe(3);
    expect(argsWatchCount).toBe(3);
  });

  test('watch 4', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;
    const [$number3, number3Changed] = numberStore3;

    const flexibleArgs = watch($number0, $number1, $number2, $number3, () => argsWatchCount++);

    const flexibleObj = watch({a: $number0, b: $number1, c: $number2, d: $number3}, () => objWatchCount++);

    const flexibleArr = watch([$number0, $number1, $number2, $number3], () => arrWatchCount++);

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

    number0Changed();
    number1Changed();
    number2Changed();
    number3Changed();

    expect(resultFlexibleArgs).toBe(4);
    expect(resultFlexibleObj).toBe(4);
    expect(resultFlexibleArr).toBe(4);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);

    expect(argsWatchCount).toBe(4);
    expect(objWatchCount).toBe(4);
    expect(argsWatchCount).toBe(4);
  });
});
