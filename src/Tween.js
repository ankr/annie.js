import { EventDispatcher } from "./EventDispatcher.js";
import { Easings } from "./easings.js";
import { clamp } from "./utils.js";

export class Tween {
  #manager;
  #timer;
  #target;
  #from = {};
  #to;
  #duration;
  #delay = 0;
  #easing = Easings.Linear.In;
  #events = new EventDispatcher();
  #repeats = 0;
  #reverse = false;
  #startTime = 0;
  #isStarted = false;
  #mutate = true;

  constructor(manager) {
    this.#manager = manager;
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

  repeat(times) {
    this.#repeats = times;

    return this;
  }

  reverse(flag = true) {
    this.#reverse = flag;

    return this;
  }

  chain(animation) {
    this.on("complete", () => {
      this.#manager.add(animation);
      animation.start();
    });

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

  restart() {
    this.#isStarted = true;
    this.#startTime = this.#timer.now();

    this.#events.dispatch("restart");

    return this;
  }

  update() {
    if (!this.#isStarted || this.#elapsedTime < this.#delay) {
      return;
    }

    // Figure out how long through the animation we are
    // result is a value in the range 0 to 1
    const progress = clamp(
      (this.#elapsedTime - this.#delay) / this.#duration,
      0,
      1
    );

    // Get corresponding value from the easing funtion
    const easingValue = this.#reverse
      ? 1 - this.#easing(progress)
      : this.#easing(progress);

    // Iterate all keys in `this.#to` and built up result
    const keys = Object.keys(this.#to);
    const result = {};

    for (const key of keys) {
      // The new tweened value
      const value =
        this.#from[key] + easingValue * (this.#to[key] - this.#from[key]);
      result[key] = value;

      // Update target in-palce if enabled
      if (this.#mutate) {
        this.#target[key] = value;
      }
    }

    this.#events.dispatch("update", result);

    // Repeat or complete
    if (progress >= 1) {
      if (this.#repeats > 0) {
        this.#repeats--;
        this.#events.dispatch("repeat", result);
        this.restart();
      } else {
        this.#events.dispatch("complete", result);
      }
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
