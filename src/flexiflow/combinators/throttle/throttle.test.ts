import {createBooleanStore, createCountStore, createStringStore, TestStore} from '../../tests';
import {delay} from '../../tests/delay';
import {throttle} from './throttle';

describe('throttle', () => {
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

  test('debounce 1', async () => {
    const [$number0, number0Changed] = numberStore0;

    const flexibleArgs = throttle($number0, 300);
    const flexibleObj = throttle({a: $number0}, 300);
    const flexibleArr = throttle([$number0], 300);

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

    number0Changed();

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    number0Changed();

    expect(resultFlexibleArgs).toBe(1);
    expect(resultFlexibleObj).toBe(1);
    expect(resultFlexibleArr).toBe(1);

    await delay(400);

    expect(resultFlexibleArgs).toBe(3);
    expect(resultFlexibleObj).toBe(3);
    expect(resultFlexibleArr).toBe(3);

    number0Changed();
    number0Changed();
    number0Changed();

    await delay(400);

    expect(resultFlexibleArgs).toBe(6);
    expect(resultFlexibleObj).toBe(6);
    expect(resultFlexibleArr).toBe(6);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });
});
