import {createBooleanStore, createCountStore, createStringStore, TestStore} from '../../tests';
import {map} from './map';

describe('map', () => {
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

  test('map 1', () => {
    const [$number0, number0Changed] = numberStore0;

    const flexibleArgs = map($number0, (a) => a + 10);
    const flexibleObj = map({a: $number0}, ({a}) => a + 100);
    const flexibleArr = map([$number0], (a) => {
      return a + 1000;
    });

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe((number) => {
      isWorkArgs = true;
      resultFlexibleArgs = number;
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe((number) => {
      isWorkObj = true;
      resultFlexibleObj = number;
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

    expect(resultFlexibleArgs).toBe(11);
    expect(resultFlexibleObj).toBe(101);
    expect(resultFlexibleArr).toBe(1001);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('map 2', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;

    const flexibleArgs = map($number0, $number1, ([a, b]) => a.getOrElse(0) + b.getOrElse(0) + 10);
    const flexibleObj = map({a: $number0, b: $number1}, ({a, b}) => a.getOrElse(0) + b.getOrElse(0) + 100);
    const flexibleArr = map([$number0, $number1], ([a, b]) => a.getOrElse(0) + b.getOrElse(0) + 1000);

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe((number) => {
      isWorkArgs = true;
      resultFlexibleArgs = number;
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe((number) => {
      isWorkObj = true;

      resultFlexibleObj = number;
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

    expect(resultFlexibleArgs).toBe(11);
    expect(resultFlexibleObj).toBe(101);
    expect(resultFlexibleArr).toBe(1001);

    number1Changed();

    expect(resultFlexibleArgs).toBe(12);
    expect(resultFlexibleObj).toBe(102);
    expect(resultFlexibleArr).toBe(1002);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('map 3', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;

    const flexibleArgs = map($number0, $number1, $number2, ([a, b, c]) => a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0) + 10);
    const flexibleObj = map({a: $number0, b: $number1, c: $number2}, ({a, b, c}) => a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0) + 100);
    const flexibleArr = map([$number0, $number1, $number2], ([a, b, c]) => a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0) + 1000);

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe((number) => {
      isWorkArgs = true;
      resultFlexibleArgs = number;
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe((number) => {
      isWorkObj = true;
      resultFlexibleObj = number;
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

    expect(resultFlexibleArgs).toBe(11);
    expect(resultFlexibleObj).toBe(101);
    expect(resultFlexibleArr).toBe(1001);

    number1Changed();

    expect(resultFlexibleArgs).toBe(12);
    expect(resultFlexibleObj).toBe(102);
    expect(resultFlexibleArr).toBe(1002);

    number2Changed();

    expect(resultFlexibleArgs).toBe(13);
    expect(resultFlexibleObj).toBe(103);
    expect(resultFlexibleArr).toBe(1003);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('map 4', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;
    const [$number3, number3Changed] = numberStore3;

    const flexibleArgs = map(
      $number0,
      $number1,
      $number2,
      $number3,
      ([a, b, c, d]) => a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0) + d.getOrElse(0) + 10,
    );

    const flexibleObj = map(
      {a: $number0, b: $number1, c: $number2, d: $number3},
      ({a, b, c, d}) => a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0) + d.getOrElse(0) + 100,
    );

    const flexibleArr = map(
      [$number0, $number1, $number2, $number3],
      ([a, b, c, d]) => a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0) + d.getOrElse(0) + 1000,
    );

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe((number) => {
      isWorkArgs = true;
      resultFlexibleArgs = number;
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe((number) => {
      isWorkObj = true;
      resultFlexibleObj = number;
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

    expect(resultFlexibleArgs).toBe(11);
    expect(resultFlexibleObj).toBe(101);
    expect(resultFlexibleArr).toBe(1001);

    number1Changed();

    expect(resultFlexibleArgs).toBe(12);
    expect(resultFlexibleObj).toBe(102);
    expect(resultFlexibleArr).toBe(1002);

    number2Changed();

    expect(resultFlexibleArgs).toBe(13);
    expect(resultFlexibleObj).toBe(103);
    expect(resultFlexibleArr).toBe(1003);

    number3Changed();

    expect(resultFlexibleArgs).toBe(14);
    expect(resultFlexibleObj).toBe(104);
    expect(resultFlexibleArr).toBe(1004);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });
});
