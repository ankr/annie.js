import { easeInLinear } from "./easings.js";

export class Animation {
  #from;
  #to;
  #duration;
  #updateCallback;
  #completeCallback;
  #easing;
  #timer;
  #delay = 0;

  constructor(manager) {
    this.#timer = manager.timer;
    this.#easing = easeInLinear;

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

    this.#updateCallback(result);

    if (progress >= 1) {
      this.#completeCallback(result);
    }
  }

  onUpdate(fn) {
    this.#updateCallback = fn;

    return this;
  }

  onComplete(fn) {
    this.#completeCallback = fn;

    return this;
  }
}
