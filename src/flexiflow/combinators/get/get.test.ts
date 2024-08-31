import {createCountStore, TestStore} from '../../tests';
import {get} from './get';

describe('get', () => {
  let isWork = false;
  let numberStore0: TestStore<number> = [] as any;

  beforeEach(() => {
    isWork = false;

    numberStore0 = createCountStore();
  });

  test('get unit', () => {
    const [$number0, number0Changed] = numberStore0;

    const flexible = get($number0);

    flexible.subscribe((result) => {
      isWork = true;

      expect(result).toBe(1);
    });

    expect(isWork).toBe(false);

    number0Changed();

    expect(isWork).toBe(true);
  });

  test('get flexible', () => {
    const [$number0, number0Changed] = numberStore0;

    const flexible = get(get($number0));

    flexible.subscribe((result) => {
      isWork = true;

      expect(result).toBe(1);
    });

    expect(isWork).toBe(false);

    number0Changed();

    expect(isWork).toBe(true);
  });

  test('get flexible wraps', () => {
    const [$number0, number0Changed] = numberStore0;

    const flexible = get(get(get(get(get(get(get(get($number0))))))));

    flexible.subscribe((result) => {
      isWork = true;

      expect(result).toBe(1);
    });

    expect(isWork).toBe(false);

    number0Changed();

    expect(isWork).toBe(true);
  });
});
