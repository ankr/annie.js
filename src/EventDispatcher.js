export class EventDispatcher {
  #listeners = {};

  on(name, fn) {
    if (!this.#listeners[name]) {
      this.#listeners[name] = new Set();
    }

    this.#listeners[name].add(fn);
  }

  of(name, fn) {
    if (!this.#listeners[name]) {
      return;
    }

    this.#listeners[name].delete(fn);
  }

  dispatch(name, payload) {
    if (!this.#listeners[name]) {
      return;
    }

    for (const fn of this.#listeners[name]) {
      fn(payload);
    }
  }
}
