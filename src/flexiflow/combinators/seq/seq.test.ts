import {createBooleanStore, createCountStore, createStringStore, TestStore} from '../../tests';
import {seq} from './seq';

describe('seq', () => {
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

  test('seq 1', () => {
    const [$number0, number0Changed] = numberStore0;

    const flexibleArgs = seq($number0);
    const flexibleObj = seq({a: $number0});
    const flexibleArr = seq([$number0]);

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
  });

  test('seq 2', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;

    const flexibleArgs = seq($number0, $number1);
    const flexibleObj = seq({a: $number0, b: $number1});
    const flexibleArr = seq([$number0, $number1]);

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

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('seq 3', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;

    const flexibleArgs = seq($number0, $number1, $number2);
    const flexibleObj = seq({a: $number0, b: $number1, c: $number2});
    const flexibleArr = seq([$number0, $number1, $number2]);

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

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('seq 4', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;
    const [$number3, number3Changed] = numberStore3;

    const flexibleArgs = seq($number0, $number1, $number2, $number3);
    const flexibleObj = seq({a: $number0, b: $number1, c: $number2, d: $number3});
    const flexibleArr = seq([$number0, $number1, $number2, $number3]);

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

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number1Changed();

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number2Changed();

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number3Changed();

    expect(resultFlexibleArgs).toBe(4);
    expect(resultFlexibleObj).toBe(4);
    expect(resultFlexibleArr).toBe(4);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('seq wraps 1', () => {
    const [$boolean0, boolean0Changed] = booleanStore0;

    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;
    const [$number3, number3Changed] = numberStore3;

    const [$string0, string0Changed] = stringStore0;
    const [$string1, string1Changed] = stringStore1;
    const [$string2, string2Changed] = stringStore2;
    const [$string3, string3Changed] = stringStore3;

    const flexible = seq(
      seq($boolean0),
      seq([$number0, $number1, $number2, $number3]),
      seq($number0, $number1, $number2, $number3),
      seq({a: $string0, b: $string1, c: $string2, d: $string3}),
    );

    let isWork = false;

    flexible.subscribe((result) => {
      isWork = true;

      const [boolean, numberArr1, numberArr2, stringObject] = result;

      expect(boolean).toBe(true);

      expect(numberArr1[0]).toBe(1);
      expect(numberArr1[1]).toBe(1);
      expect(numberArr1[2]).toBe(3);
      expect(numberArr1[3]).toBe(1);

      expect(numberArr2[0]).toBe(1);
      expect(numberArr2[1]).toBe(1);
      expect(numberArr2[2]).toBe(3);
      expect(numberArr2[3]).toBe(1);

      expect(stringObject.a).toBe('__foo');
      expect(stringObject.b).toBe('__foo__foo');
      expect(stringObject.c).toBe('__foo');
      expect(stringObject.d).toBe('__foo');
    });

    boolean0Changed();

    number0Changed();
    string0Changed();

    number1Changed();
    string1Changed();
    string1Changed();

    number2Changed();
    number2Changed();
    number2Changed();
    string2Changed();

    number3Changed();
    string3Changed();

    expect(isWork).toBe(true);
  });

  test('seq wraps 2', () => {
    const [$boolean0, boolean0Changed] = booleanStore0;

    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;
    const [$number3, number3Changed] = numberStore3;

    const [$string0, string0Changed] = stringStore0;
    const [$string1, string1Changed] = stringStore1;
    const [$string2, string2Changed] = stringStore2;
    const [$string3, string3Changed] = stringStore3;

    const flexible = seq(
      seq([$number0, $string1, $number2, $string3]),
      seq($number0, $number1, $string2, $number3),
      seq({a: $string0, b: $number0, c: $boolean0, d: $string3}),
    );

    let isWork = false;

    flexible.subscribe((result) => {
      isWork = true;

      const [arr1, arr2, object] = result;

      expect(arr1[0]).toBe(1);
      expect(arr1[1]).toBe('__foo');
      expect(arr1[2]).toBe(1);
      expect(arr1[3]).toBe('__foo');

      expect(arr2[0]).toBe(1);
      expect(arr2[1]).toBe(1);
      expect(arr2[2]).toBe('__foo');
      expect(arr2[3]).toBe(1);

      expect(object.a).toBe('__foo');
      expect(object.b).toBe(1);
      expect(object.c).toBe(true);
      expect(object.d).toBe('__foo');
    });

    boolean0Changed();

    number0Changed();
    string0Changed();

    number1Changed();
    string1Changed();

    number2Changed();
    string2Changed();

    number3Changed();
    string3Changed();

    expect(isWork).toBe(true);
  });
});
