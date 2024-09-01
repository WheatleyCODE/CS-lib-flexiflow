export const isPromiseLike = (value: any): value is PromiseLike<unknown> => {
  if (value != null) {
    return typeof value?.then === 'function';
  }

  return false;
};
