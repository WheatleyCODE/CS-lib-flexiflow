import {createBooleanStore, createCountStore, createStringStore, TestStore} from '../../tests';
import {repeat} from './repeat';

describe('repeat', () => {
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

  test('repeat 1', () => {
    const [$number0, number0Changed] = numberStore0;

    const flexibleArgs = repeat($number0, 3);
    const flexibleObj = repeat({a: $number0}, 3);
    const flexibleArr = repeat([$number0], 3);

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe(([rA1, rA2, rA3]) => {
      isWorkArgs = true;
      resultFlexibleArgs = rA1 + rA2 + rA3;
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe(([rA1Obj, rA2Obj, rA3Obj]) => {
      isWorkObj = true;
      resultFlexibleObj = rA1Obj.a + rA2Obj.a + rA3Obj.a;
    });

    let resultFlexibleArr = 0;

    flexibleArr.subscribe(([rA1, rA2, rA3]) => {
      isWorkArr = true;
      resultFlexibleArr = rA1 + rA2 + rA3;
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed();

    expect(resultFlexibleArgs).toBe(3);
    expect(resultFlexibleObj).toBe(3);
    expect(resultFlexibleArr).toBe(3);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('repeat 2', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;

    const flexibleArgs = repeat($number0, $number1, 3);
    const flexibleObj = repeat({a: $number0, b: $number1}, 3);
    const flexibleArr = repeat([$number0, $number1], 3);

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe(([[rA1, rB1], [rA2, rB2], [rA3, rB3]]) => {
      isWorkArgs = true;
      resultFlexibleArgs = rA1.getOrElse(0) + rB1.getOrElse(0) + rA2.getOrElse(0) + rB2.getOrElse(0) + rA3.getOrElse(0) + rB3.getOrElse(0);
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe(([rAB1Obj, rAB2Obj, rAB3Obj]) => {
      isWorkObj = true;
      resultFlexibleObj =
        rAB1Obj.a.getOrElse(0) +
        rAB1Obj.b.getOrElse(0) +
        rAB2Obj.a.getOrElse(0) +
        rAB2Obj.b.getOrElse(0) +
        rAB3Obj.a.getOrElse(0) +
        rAB3Obj.b.getOrElse(0);
    });

    let resultFlexibleArr = 0;

    flexibleArr.subscribe(([[rA1, rB1], [rA2, rB2], [rA3, rB3]]) => {
      isWorkArr = true;
      resultFlexibleArr = rA1.getOrElse(0) + rB1.getOrElse(0) + rA2.getOrElse(0) + rB2.getOrElse(0) + rA3.getOrElse(0) + rB3.getOrElse(0);
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed();
    number1Changed();

    expect(resultFlexibleArgs).toBe(6);
    expect(resultFlexibleObj).toBe(6);
    expect(resultFlexibleArr).toBe(6);

    number0Changed();
    number1Changed();

    expect(resultFlexibleArgs).toBe(12);
    expect(resultFlexibleObj).toBe(12);
    expect(resultFlexibleArr).toBe(12);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('repeat 3', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;

    const flexibleArgs = repeat($number0, $number1, $number2, 3);
    const flexibleObj = repeat({a: $number0, b: $number1, c: $number2}, 3);
    const flexibleArr = repeat([$number0, $number1, $number2], 3);

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe(([[rA1, rB1, rC1], [rA2, rB2, rC2], [rA3, rB3, rC3]]) => {
      isWorkArgs = true;
      resultFlexibleArgs =
        rA1.getOrElse(0) +
        rB1.getOrElse(0) +
        rC1.getOrElse(0) +
        rA2.getOrElse(0) +
        rB2.getOrElse(0) +
        rC2.getOrElse(0) +
        rA3.getOrElse(0) +
        rB3.getOrElse(0) +
        rC3.getOrElse(0);
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe(([rABC1Obj, rABC2Obj, rABC3Obj]) => {
      isWorkObj = true;
      resultFlexibleObj =
        rABC1Obj.a.getOrElse(0) +
        rABC1Obj.b.getOrElse(0) +
        rABC1Obj.c.getOrElse(0) +
        rABC2Obj.a.getOrElse(0) +
        rABC2Obj.b.getOrElse(0) +
        rABC2Obj.c.getOrElse(0) +
        rABC3Obj.a.getOrElse(0) +
        rABC3Obj.b.getOrElse(0) +
        rABC3Obj.c.getOrElse(0);
    });

    let resultFlexibleArr = 0;

    flexibleArr.subscribe(([[rA1, rB1, rC1], [rA2, rB2, rC2], [rA3, rB3, rC3]]) => {
      isWorkArr = true;
      resultFlexibleArr =
        rA1.getOrElse(0) +
        rB1.getOrElse(0) +
        rC1.getOrElse(0) +
        rA2.getOrElse(0) +
        rB2.getOrElse(0) +
        rC2.getOrElse(0) +
        rA3.getOrElse(0) +
        rB3.getOrElse(0) +
        rC3.getOrElse(0);
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed();
    number1Changed();
    number2Changed();

    expect(resultFlexibleArgs).toBe(9);
    expect(resultFlexibleObj).toBe(9);
    expect(resultFlexibleArr).toBe(9);

    number0Changed();
    number1Changed();
    number2Changed();

    expect(resultFlexibleArgs).toBe(18);
    expect(resultFlexibleObj).toBe(18);
    expect(resultFlexibleArr).toBe(18);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });

  test('repeat 4', () => {
    const [$number0, number0Changed] = numberStore0;
    const [$number1, number1Changed] = numberStore1;
    const [$number2, number2Changed] = numberStore2;
    const [$number3, number3Changed] = numberStore3;

    const flexibleArgs = repeat($number0, $number1, $number2, $number3, 3);
    const flexibleObj = repeat({a: $number0, b: $number1, c: $number2, d: $number3}, 3);
    const flexibleArr = repeat([$number0, $number1, $number2, $number3], 3);

    let resultFlexibleArgs = 0;

    flexibleArgs.subscribe(([[rA1, rB1, rC1, rD1], [rA2, rB2, rC2, rD2], [rA3, rB3, rC3, rD3]]) => {
      isWorkArgs = true;
      resultFlexibleArgs =
        rA1.getOrElse(0) +
        rB1.getOrElse(0) +
        rC1.getOrElse(0) +
        rD1.getOrElse(0) +
        rA2.getOrElse(0) +
        rB2.getOrElse(0) +
        rC2.getOrElse(0) +
        rD2.getOrElse(0) +
        rA3.getOrElse(0) +
        rB3.getOrElse(0) +
        rC3.getOrElse(0) +
        rD3.getOrElse(0);
    });

    let resultFlexibleObj = 0;

    flexibleObj.subscribe(([rABCD1Obj, rABCD2Obj, rABCD3Obj]) => {
      isWorkObj = true;
      resultFlexibleObj =
        rABCD1Obj.a.getOrElse(0) +
        rABCD1Obj.b.getOrElse(0) +
        rABCD1Obj.c.getOrElse(0) +
        rABCD1Obj.d.getOrElse(0) +
        rABCD2Obj.a.getOrElse(0) +
        rABCD2Obj.b.getOrElse(0) +
        rABCD2Obj.c.getOrElse(0) +
        rABCD2Obj.d.getOrElse(0) +
        rABCD3Obj.a.getOrElse(0) +
        rABCD3Obj.b.getOrElse(0) +
        rABCD3Obj.c.getOrElse(0) +
        rABCD3Obj.d.getOrElse(0);
    });

    let resultFlexibleArr = 0;

    flexibleArr.subscribe(([[rA1, rB1, rC1, rD1], [rA2, rB2, rC2, rD2], [rA3, rB3, rC3, rD3]]) => {
      isWorkArr = true;
      resultFlexibleArr =
        rA1.getOrElse(0) +
        rB1.getOrElse(0) +
        rC1.getOrElse(0) +
        rD1.getOrElse(0) +
        rA2.getOrElse(0) +
        rB2.getOrElse(0) +
        rC2.getOrElse(0) +
        rD2.getOrElse(0) +
        rA3.getOrElse(0) +
        rB3.getOrElse(0) +
        rC3.getOrElse(0) +
        rD3.getOrElse(0);
    });

    expect(resultFlexibleArgs).toBe(0);
    expect(resultFlexibleObj).toBe(0);
    expect(resultFlexibleArr).toBe(0);

    number0Changed();
    number1Changed();
    number2Changed();
    number3Changed();

    expect(resultFlexibleArgs).toBe(12);
    expect(resultFlexibleObj).toBe(12);
    expect(resultFlexibleArr).toBe(12);

    number0Changed();
    number1Changed();
    number2Changed();
    number3Changed();

    expect(resultFlexibleArgs).toBe(24);
    expect(resultFlexibleObj).toBe(24);
    expect(resultFlexibleArr).toBe(24);

    expect(isWorkArgs).toBe(true);
    expect(isWorkObj).toBe(true);
    expect(isWorkArr).toBe(true);
  });
});
