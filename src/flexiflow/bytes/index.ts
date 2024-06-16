// Оптимизации для библиотеки
export interface SourceDataView<T> {
  get: () => T,
  set: () => T,
}
