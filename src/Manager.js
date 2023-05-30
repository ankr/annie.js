export class Manager {
  #animations = new Set();

  constructor(timer) {
    this.timer = timer;
  }

  add(animation) {
    this.#animations.add(animation);

    animation.on("complete", () => {
      this.#animations.delete(animation);
    });

    return animation;
  }

  pause() {
    this.timer.pause();

    return this;
  }

  resume() {
    this.timer.resume();

    return this;
  }

  toggle() {
    this.timer.toggle();

    return this;
  }

  update() {
    for (const animation of this.#animations) {
      animation.update();
    }

    return this;
  }
}
