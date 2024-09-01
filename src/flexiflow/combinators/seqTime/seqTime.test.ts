import {createBooleanStore, createCountStore, createStringStore, TestStore} from '../../tests';
import {delay} from '../../tests/delay';
import {seqTime} from './seqTime';

describe('seqTime', () => {
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

  test('seqTime 1', async () => {
    const [$number0, number0Changed] = numberStore0;

    const flexibleArgs = seqTime($number0, 300);
    const flexibleObj = seqTime({a: $number0}, 300);
    const flexibleArr = seqTime([$number0], 300);

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

    await delay(500);

    number0Changed();

    expect(resultFlexibleArgs).toBe(2);
    expect(resultFlexibleObj).toBe(2);
    expect(resultFlexibleArr).toBe(2);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('seqTime 2', async () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;

    const flexibleArgs = seqTime($number0, $number1, 300);
    const flexibleObj = seqTime({a: $number0, b: $number1}, 300);
    const flexibleArr = seqTime([$number0, $number1], 300);

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe(([a, b]) => {
      isWorkArgs = true;
      resultFlexibleArgs = a + b;
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe(({a, b}) => {
      isWorkObj = true;
      resultFlexibleObj = a + b;
    });

    let resultFlexibleArr = 0;

    flexibleArr.subscribe(([a, b]) => {
      isWorkArr = true;
      resultFlexibleArr = a + b;
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed();

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number1Changed();

    expect(resultFlexibleArgs).toBe(2);
    expect(resultFlexibleObj).toBe(2);
    expect(resultFlexibleArr).toBe(2);

    await delay(500);

    number0Changed();

    // Not be 3
    expect(resultFlexibleArgs).toBe(2);
    expect(resultFlexibleObj).toBe(2);
    expect(resultFlexibleArr).toBe(2);

    number1Changed();

    expect(resultFlexibleArgs).toBe(4);
    expect(resultFlexibleObj).toBe(4);
    expect(resultFlexibleArr).toBe(4);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('seqTime 3', async () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;

    const flexibleArgs = seqTime($number0, $number1, $number2, 300);
    const flexibleObj = seqTime({a: $number0, b: $number1, c: $number2}, 300);
    const flexibleArr = seqTime([$number0, $number1, $number2], 300);

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe(([a, b, c]) => {
      isWorkArgs = true;
      resultFlexibleArgs = a + b + c;
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe(({a, b, c}) => {
      isWorkObj = true;
      resultFlexibleObj = a + b + c;
    });

    let resultFlexibleArr = 0;

    flexibleArr.subscribe(([a, b, c]) => {
      isWorkArr = true;
      resultFlexibleArr = a + b + c;
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed();

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number1Changed();

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number2Changed();

    expect(resultFlexibleArgs).toBe(3);
    expect(resultFlexibleObj).toBe(3);
    expect(resultFlexibleArr).toBe(3);

    await delay(500);

    number0Changed();

    // Not be 4
    expect(resultFlexibleArgs).toBe(3);
    expect(resultFlexibleObj).toBe(3);
    expect(resultFlexibleArr).toBe(3);

    number1Changed();
    number2Changed();

    expect(resultFlexibleArgs).toBe(6);
    expect(resultFlexibleObj).toBe(6);
    expect(resultFlexibleArr).toBe(6);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('seqTime 3', async () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;
    const [$number3, number3Changed] = numberStore3;

    const flexibleArgs = seqTime($number0, $number1, $number2, $number3, 300);
    const flexibleObj = seqTime({a: $number0, b: $number1, c: $number2, d: $number3}, 300);
    const flexibleArr = seqTime([$number0, $number1, $number2, $number3], 300);

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe(([a, b, c, d]) => {
      isWorkArgs = true;
      resultFlexibleArgs = a + b + c + d;
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe(({a, b, c, d}) => {
      isWorkObj = true;
      resultFlexibleObj = a + b + c + d;
    });

    let resultFlexibleArr = 0;

    flexibleArr.subscribe(([a, b, c, d]) => {
      isWorkArr = true;
      resultFlexibleArr = a + b + c + d;
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed();
    number1Changed();
    number2Changed();

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number3Changed();

    expect(resultFlexibleArgs).toBe(4);
    expect(resultFlexibleObj).toBe(4);
    expect(resultFlexibleArr).toBe(4);

    await delay(500);

    number0Changed();

    // Not be 5
    expect(resultFlexibleArgs).toBe(4);
    expect(resultFlexibleObj).toBe(4);
    expect(resultFlexibleArr).toBe(4);

    number1Changed();
    number2Changed();
    number3Changed();

    expect(resultFlexibleArgs).toBe(8);
    expect(resultFlexibleObj).toBe(8);
    expect(resultFlexibleArr).toBe(8);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });
});
