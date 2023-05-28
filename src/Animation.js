import { EventDispatcher } from "./EventDispatcher.js";
import { Easings } from "./easings.js";

export class Animation {
  #from;
  #to;
  #duration;
  #delay = 0;
  #easing = Easings.Linear.In;
  #events = new EventDispatcher();
  #timer;

  constructor(manager) {
    this.#timer = manager.timer;

    manager.add(this);
  }

  from(from) {
    this.#from = from;

    return this;
  }

  to(to) {
    this.#to = to;

    return this;
  }

  duration(ms) {
    this.#duration = ms;

    return this;
  }

  easing(fn) {
    this.#easing = fn;

    return this;
  }

  delay(ms) {
    this.#delay = ms;

    return this;
  }

  start() {
    return this;
  }

  update() {
    if (this.#timer.elapsedTime < this.#delay) {
      return;
    }

    const progress = Math.min(
      (this.#timer.elapsedTime - this.#delay) / this.#duration,
      1
    );
    const easingValue = this.#easing(progress);
    const keys = Object.keys(this.#to);
    const result = {};

    for (const key of keys) {
      result[key] =
        this.#from[key] + easingValue * (this.#to[key] - this.#from[key]);
    }

    this.#events.dispatch("update", result);

    if (progress >= 1) {
      this.#events.dispatch("complete", result);
    }
  }

  on(name, fn) {
    this.#events.on(name, fn);

    return this;
  }

  off(name, fn) {
    this.#events.off(name, fn);

    return this;
  }
}
