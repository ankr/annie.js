export class EventDispatcher {
  #observers = {};

  on(name, fn) {
    if (!this.#observers[name]) {
      this.#observers[name] = new Set();
    }

    this.#observers[name].add(fn);
  }

  of(name, fn) {
    if (!this.#observers[name]) {
      return;
    }

    this.#observers[name].delete(fn);
  }

  dispatch(name, payload) {
    if (!this.#observers[name]) {
      return;
    }

    for (const fn of this.#observers[name]) {
      fn(payload);
    }
  }
}
