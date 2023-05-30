# annie.js

Simple animation library.

## Example

```javascript
import { Timer } from "@ankr/timer";
import { Tween, Manager, Easings } from "@ankr/annie";

// Setup timer and animations manager
const timer = new Timer();
const manager = new Manager(timer);

const target = { x: 100, y: 100 };

// Create tween animation
const tween = new Tween(manager)
    .from(target)
    .to({ x: 500, y: 500 })
    .duration(2000)
    .delay(500)
    .easing(Easings.Bounce.Out);

// Kick everything off
requestAnimationFrame(() => {
    tween.start();
    loop();
});

// The main animation loop
const loop = () => {
    requestAnimationFrame(loop);

    // Remember to tick the timer forward ...
    timer.tick();

    // ... before updating animations
    manager.update();

    // Draw target
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
    ctx.fill();
};
```
