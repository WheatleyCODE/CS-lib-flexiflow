import {Flexible} from '../../flexible';

type CombinatorNames =
  | 'seq'
  | 'map'
  | 'get'
  | 'filter'
  | 'debounce'
  | 'throttle'
  | 'enumerable'
  | 'repeat'
  | 'watch'
  | 'merge'
  | 'checkAfter'
  | 'checkBefore';

export function getCombinatorError(combinatorName: CombinatorNames): Flexible<unknown> {
  return new Flexible((subscriber) => {
    subscriber.error(`Function ${combinatorName} contains unknown arguments`);
    subscriber.complete();

    return () => {
      subscriber.unsubscribe();
    };
  });
}
