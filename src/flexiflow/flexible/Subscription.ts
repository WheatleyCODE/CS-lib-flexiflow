import {isFunction} from '../utils/isFunction';
import {SubscriptionLike, Destroy, Unsubscribable} from './types';

export class Subscription implements SubscriptionLike {
  isClosed = false;

  private destroyers: Set<Exclude<Destroy, void>> | null = null;

  constructor(private initialDestroy?: () => void) {}

  unsubscribe(): void {
    let errors: unknown[] | undefined;

    if (!this.isClosed) {
      this.isClosed = true;

      if (isFunction(this.initialDestroy)) {
        try {
          this.initialDestroy();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }

      const {destroyers} = this;

      if (destroyers) {
        this.destroyers = null;

        for (const destroyer of destroyers) {
          try {
            executeDestroyer(destroyer);

          } catch (err) {
            errors = errors ?? [];

            if (err instanceof UnsubscriptionError) {
              errors.push(...err.errors);
            } else {
              errors.push(err);
            }
          }
        }
      }

      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  }

  add(destroyer: Destroy): void {
    if (destroyer && destroyer !== this) {
      if (this.isClosed) {
        executeDestroyer(destroyer);

      } else {
        if (destroyer && 'add' in destroyer) {
          destroyer.add(() => {
            this.remove(destroyer);
          });
        }

        this.destroyers ??= new Set();
        this.destroyers.add(destroyer);
      }
    }
  }

  remove(destroyer: Exclude<Destroy, void>): void {
    this.destroyers?.delete(destroyer);
  }
}

export interface Subscription {
  [Symbol.dispose](): void;
}

if (typeof Symbol.dispose === 'symbol') {
  Subscription.prototype[Symbol.dispose] = Subscription.prototype.unsubscribe;
}

function executeDestroyer(destroyer: Unsubscribable | (() => void)) {
  if (isFunction(destroyer)) {
    destroyer();
  } else {
    destroyer.unsubscribe();
  }
}

export class UnsubscriptionError extends Error {
  constructor(public errors: any[]) {
    super(errors.map((err, i) => `${i + 1} ${err.toString()}`).join('\n  '));

    this.name = 'UnsubscriptionError';
  }
}
