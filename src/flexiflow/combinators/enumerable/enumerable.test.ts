import {createBooleanStore, createCountStore, createStringStore, TestStore} from '../../tests';
import {enumerable} from './enumerable';

describe('enumerable', () => {
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

  test('enumerable 1', () => {
    const [$number0, number0Changed] = numberStore0;

    const flexibleArgs = enumerable($number0);
    const flexibleObj = enumerable({a: $number0});
    const flexibleArr = enumerable([$number0]);

    let resultFlexibleArgs = 0;
    let resultFlexibleArgsCount = 0;

    flexibleArgs.subscribe(([number, count]) => {
      isWorkArgs = true;
      resultFlexibleArgs = number;
      resultFlexibleArgsCount = count;
    });

    let resultFlexibleObj = 0;
    let resultFlexibleObjCount = 0;

    flexibleObj.subscribe(([{a}, count]) => {
      isWorkObj = true;
      resultFlexibleObj = a;
      resultFlexibleObjCount = count;
    });

    let resultFlexibleArr = 0;
    let resultFlexibleArrCount = 0;

    flexibleArr.subscribe(([number, count]) => {
      isWorkArr = true;
      resultFlexibleArr = number;
      resultFlexibleArrCount = count;
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    expect(resultFlexibleArgsCount).toBe(0);
    expect(resultFlexibleObjCount).toBe(0);
    expect(resultFlexibleArrCount).toBe(0);

    number0Changed();

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    expect(resultFlexibleArgsCount).toBe(1);
    expect(resultFlexibleObjCount).toBe(1);
    expect(resultFlexibleArrCount).toBe(1);

    number0Changed();

    expect(resultFlexibleArgs).toBe(2);
    expect(resultFlexibleObj).toBe(2);
    expect(resultFlexibleArr).toBe(2);

    expect(resultFlexibleArgsCount).toBe(2);
    expect(resultFlexibleObjCount).toBe(2);
    expect(resultFlexibleArrCount).toBe(2);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('enumerable 2', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;

    const flexibleArgs = enumerable($number0, $number1);
    const flexibleObj = enumerable({a: $number0, b: $number1});
    const flexibleArr = enumerable([$number0, $number1]);

    let resultFlexibleArgs = 0;
    let resultFlexibleArgsCount = 0;

    flexibleArgs.subscribe(([[a, b], count]) => {
      isWorkArgs = true;
      resultFlexibleArgs = (a.getOrElse(0) + b.getOrElse(0)) * 10;
      resultFlexibleArgsCount = count;
    });

    let resultFlexibleObj = 0;
    let resultFlexibleObjCount = 0;

    flexibleObj.subscribe(([{a, b}, count]) => {
      isWorkObj = true;
      resultFlexibleObj = (a.getOrElse(0) + b.getOrElse(0)) * 10;
      resultFlexibleObjCount = count;
    });

    let resultFlexibleArr = 0;
    let resultFlexibleArrCount = 0;

    flexibleArr.subscribe(([[a, b], count]) => {
      isWorkArr = true;
      resultFlexibleArr = (a.getOrElse(0) + b.getOrElse(0)) * 10;
      resultFlexibleArrCount = count;
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    expect(resultFlexibleArgsCount).toBe(0);
    expect(resultFlexibleObjCount).toBe(0);
    expect(resultFlexibleArrCount).toBe(0);

    number0Changed();
    number1Changed();

    expect(resultFlexibleArgs).toBe(20);
    expect(resultFlexibleObj).toBe(20);
    expect(resultFlexibleArr).toBe(20);

    expect(resultFlexibleArgsCount).toBe(2);
    expect(resultFlexibleObjCount).toBe(2);
    expect(resultFlexibleArrCount).toBe(2);

    number0Changed();
    number1Changed();

    expect(resultFlexibleArgs).toBe(40);
    expect(resultFlexibleObj).toBe(40);
    expect(resultFlexibleArr).toBe(40);

    expect(resultFlexibleArgsCount).toBe(4);
    expect(resultFlexibleObjCount).toBe(4);
    expect(resultFlexibleArrCount).toBe(4);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('enumerable 3', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;

    const flexibleArgs = enumerable($number0, $number1, $number2);
    const flexibleObj = enumerable({a: $number0, b: $number1, c: $number2});
    const flexibleArr = enumerable([$number0, $number1, $number2]);

    let resultFlexibleArgs = 0;
    let resultFlexibleArgsCount = 0;

    flexibleArgs.subscribe(([[a, b, c], count]) => {
      isWorkArgs = true;
      resultFlexibleArgs = (a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0)) * 10;
      resultFlexibleArgsCount = count;
    });

    let resultFlexibleObj = 0;
    let resultFlexibleObjCount = 0;

    flexibleObj.subscribe(([{a, b, c}, count]) => {
      isWorkObj = true;
      resultFlexibleObj = (a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0)) * 10;
      resultFlexibleObjCount = count;
    });

    let resultFlexibleArr = 0;
    let resultFlexibleArrCount = 0;

    flexibleArr.subscribe(([[a, b, c], count]) => {
      isWorkArr = true;
      resultFlexibleArr = (a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0)) * 10;
      resultFlexibleArrCount = count;
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    expect(resultFlexibleArgsCount).toBe(0);
    expect(resultFlexibleObjCount).toBe(0);
    expect(resultFlexibleArrCount).toBe(0);

    number0Changed();
    number1Changed();
    number2Changed();

    expect(resultFlexibleArgs).toBe(30);
    expect(resultFlexibleObj).toBe(30);
    expect(resultFlexibleArr).toBe(30);

    expect(resultFlexibleArgsCount).toBe(3);
    expect(resultFlexibleObjCount).toBe(3);
    expect(resultFlexibleArrCount).toBe(3);

    number0Changed();
    number1Changed();
    number2Changed();

    expect(resultFlexibleArgs).toBe(60);
    expect(resultFlexibleObj).toBe(60);
    expect(resultFlexibleArr).toBe(60);

    expect(resultFlexibleArgsCount).toBe(6);
    expect(resultFlexibleObjCount).toBe(6);
    expect(resultFlexibleArrCount).toBe(6);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('enumerable 4', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;
    const [$number3, number3Changed] = numberStore3;

    const flexibleArgs = enumerable($number0, $number1, $number2, $number3);
    const flexibleObj = enumerable({a: $number0, b: $number1, c: $number2, d: $number3});
    const flexibleArr = enumerable([$number0, $number1, $number2, $number3]);

    let resultFlexibleArgs = 0;
    let resultFlexibleArgsCount = 0;

    flexibleArgs.subscribe(([[a, b, c, d], count]) => {
      isWorkArgs = true;
      resultFlexibleArgs = (a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0) + d.getOrElse(0)) * 10;
      resultFlexibleArgsCount = count;
    });

    let resultFlexibleObj = 0;
    let resultFlexibleObjCount = 0;

    flexibleObj.subscribe(([{a, b, c, d}, count]) => {
      isWorkObj = true;
      resultFlexibleObj = (a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0) + d.getOrElse(0)) * 10;
      resultFlexibleObjCount = count;
    });

    let resultFlexibleArr = 0;
    let resultFlexibleArrCount = 0;

    flexibleArr.subscribe(([[a, b, c, d], count]) => {
      isWorkArr = true;
      resultFlexibleArr = (a.getOrElse(0) + b.getOrElse(0) + c.getOrElse(0) + d.getOrElse(0)) * 10;
      resultFlexibleArrCount = count;
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    expect(resultFlexibleArgsCount).toBe(0);
    expect(resultFlexibleObjCount).toBe(0);
    expect(resultFlexibleArrCount).toBe(0);

    number0Changed();
    number1Changed();
    number2Changed();
    number3Changed();

    expect(resultFlexibleArgs).toBe(40);
    expect(resultFlexibleObj).toBe(40);
    expect(resultFlexibleArr).toBe(40);

    expect(resultFlexibleArgsCount).toBe(4);
    expect(resultFlexibleObjCount).toBe(4);
    expect(resultFlexibleArrCount).toBe(4);

    number0Changed();
    number1Changed();
    number2Changed();
    number3Changed();

    expect(resultFlexibleArgs).toBe(80);
    expect(resultFlexibleObj).toBe(80);
    expect(resultFlexibleArr).toBe(80);

    expect(resultFlexibleArgsCount).toBe(8);
    expect(resultFlexibleObjCount).toBe(8);
    expect(resultFlexibleArrCount).toBe(8);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });
});
