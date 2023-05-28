# annie.js

Simple tween animation library.

## Example

```javascript
import { Timer } from "@ankr/timer";
import { Animation, AnimationsManager, Easings } from "@ankr/annie";

const target = { x: 100, y: 100 };

// Setup timer and animations manager
const timer = new Timer();
const manager = new AnimationsManager(timer);

// Create animation
const animation = new Animation(manager)
    .from(target)
    .to({ x: 500, y: 500 })
    .duration(2000)
    .delay(500)
    .easing(Easings.Elastic.Out);

// Kick everything off
requestAnimationFrame(() => {
    first.start();
    loop();
});

// The main animation loop
const loop = () => {
    requestAnimationFrame(loop);

    // Remember to tick the timer forward
    timer.tick();

    // Before updating animations
    manager.update();

    // Draw target
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
    ctx.fill();
};
```
