import { EventDispatcher } from "./EventDispatcher.js";
import { Easings } from "./easings.js";
import { clamp } from "./utils.js";

export class Animation {
  #target;
  #from = {};
  #to;
  #duration;
  #delay = 0;
  #easing = Easings.Linear.In;
  #events = new EventDispatcher();
  #timer;
  #reverse = false;
  #startTime = 0;
  #isStarted = false;
  #mutate = true;

  constructor(manager) {
    this.#timer = manager.timer;

    manager.add(this);
  }

  get #elapsedTime() {
    return this.#timer.elapsedTime - this.#startTime;
  }

  from(target) {
    this.#target = target;

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

  reverse(flag = true) {
    this.#reverse = flag;

    return this;
  }

  chain(animation) {
    this.on("complete", () => animation.start());

    return this;
  }

  mutate(flag = true) {
    this.#mutate = flag;

    return this;
  }

  start() {
    for (const key of Object.keys(this.#to)) {
      this.#from[key] = this.#target[key];
    }

    this.#isStarted = true;
    this.#startTime = this.#timer.now();

    this.#events.dispatch("start");

    return this;
  }

  update() {
    if (!this.#isStarted) {
      return;
    }

    if (this.#elapsedTime < this.#delay) {
      return;
    }

    const progress = clamp(
      (this.#elapsedTime - this.#delay) / this.#duration,
      0,
      1
    );
    const easingValue = this.#reverse
      ? 1 - this.#easing(progress)
      : this.#easing(progress);
    const keys = Object.keys(this.#to);
    const result = {};

    for (const key of keys) {
      const value =
        this.#from[key] + easingValue * (this.#to[key] - this.#from[key]);
      result[key] = value;

      if (this.#mutate) {
        this.#target[key] = value;
      }
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
