import {createBooleanStore, createCountStore, createStringStore, TestStore} from '../../tests';
import {merge} from './merge';

describe('merge', () => {
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

  test('merge 1', () => {
    const [$number0, number0Changed] = numberStore0;

    const flexibleArgs = merge($number0);
    const flexibleObj = merge({a: $number0});
    const flexibleArr = merge([$number0]);

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

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('merge 2', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$string0, string0Changed] = stringStore0;

    const flexibleArgs = merge($number0, $string0);
    const flexibleObj = merge({a: $number0, b: $string0});
    const flexibleArr = merge([$number0, $string0]);

    let resultFlexibleArgs: number | string = 0;

    flexibleArgs.subscribe((value) => {
      isWorkArgs = true;
      resultFlexibleArgs = value;
    });

    let resultFlexibleObj: number | string = 0;

    flexibleObj.subscribe((value) => {
      isWorkObj = true;
      resultFlexibleObj = value;
    });

    let resultFlexibleArr: number | string = 0;

    flexibleArr.subscribe((value) => {
      isWorkArr = true;
      resultFlexibleArr = value;
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed();

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    string0Changed();

    expect(resultFlexibleArgs).toBe('__foo');
    expect(resultFlexibleObj).toBe('__foo');
    expect(resultFlexibleArr).toBe('__foo');

    number0Changed();

    expect(resultFlexibleArgs).toBe(2);
    expect(resultFlexibleObj).toBe(2);
    expect(resultFlexibleArr).toBe(2);

    string0Changed();

    expect(resultFlexibleArgs).toBe('__foo__foo');
    expect(resultFlexibleObj).toBe('__foo__foo');
    expect(resultFlexibleArr).toBe('__foo__foo');

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('merge 3', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$string0, string0Changed] = stringStore0;

    const flexibleArgs = merge($number0, $string0, $number1);
    const flexibleObj = merge({a: $number0, b: $string0, c: $number1});
    const flexibleArr = merge([$number0, $string0, $number1]);

    let resultFlexibleArgs: number | string = 0;

    flexibleArgs.subscribe((value) => {
      isWorkArgs = true;
      resultFlexibleArgs = value;
    });

    let resultFlexibleObj: number | string = 0;

    flexibleObj.subscribe((value) => {
      isWorkObj = true;
      resultFlexibleObj = value;
    });

    let resultFlexibleArr: number | string = 0;

    flexibleArr.subscribe((value) => {
      isWorkArr = true;
      resultFlexibleArr = value;
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed();

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    string0Changed();

    expect(resultFlexibleArgs).toBe('__foo');
    expect(resultFlexibleObj).toBe('__foo');
    expect(resultFlexibleArr).toBe('__foo');

    number0Changed();

    expect(resultFlexibleArgs).toBe(2);
    expect(resultFlexibleObj).toBe(2);
    expect(resultFlexibleArr).toBe(2);

    string0Changed();

    expect(resultFlexibleArgs).toBe('__foo__foo');
    expect(resultFlexibleObj).toBe('__foo__foo');
    expect(resultFlexibleArr).toBe('__foo__foo');

    number1Changed();

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('merge 4', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$string0, string0Changed] = stringStore0;
    const [$string1, string1Changed] = stringStore1;

    const flexibleArgs = merge($number0, $string0, $number1, $string1);
    const flexibleObj = merge({a: $number0, b: $string0, c: $number1, d: $string1});
    const flexibleArr = merge([$number0, $string0, $number1, $string1]);

    let resultFlexibleArgs: number | string = 0;

    flexibleArgs.subscribe((value) => {
      isWorkArgs = true;
      resultFlexibleArgs = value;
    });

    let resultFlexibleObj: number | string = 0;

    flexibleObj.subscribe((value) => {
      isWorkObj = true;
      resultFlexibleObj = value;
    });

    let resultFlexibleArr: number | string = 0;

    flexibleArr.subscribe((value) => {
      isWorkArr = true;
      resultFlexibleArr = value;
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed();

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    string0Changed();

    expect(resultFlexibleArgs).toBe('__foo');
    expect(resultFlexibleObj).toBe('__foo');
    expect(resultFlexibleArr).toBe('__foo');

    number0Changed();

    expect(resultFlexibleArgs).toBe(2);
    expect(resultFlexibleObj).toBe(2);
    expect(resultFlexibleArr).toBe(2);

    string0Changed();

    expect(resultFlexibleArgs).toBe('__foo__foo');
    expect(resultFlexibleObj).toBe('__foo__foo');
    expect(resultFlexibleArr).toBe('__foo__foo');

    number1Changed();

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    string1Changed();

    expect(resultFlexibleArgs).toBe('__foo');
    expect(resultFlexibleObj).toBe('__foo');
    expect(resultFlexibleArr).toBe('__foo');

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });
});
