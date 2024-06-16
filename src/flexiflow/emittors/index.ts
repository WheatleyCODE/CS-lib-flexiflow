export interface Emitter {
  on: () => void;
  off: () => void;
  subscribe: () => void;
}