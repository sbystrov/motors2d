import {Physics} from './Physics';

export interface Drawable {
  render(context: CanvasRenderingContext2D): void;
}

export class Renderer {
  background: string = '#fff';
  physics: Physics;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  previousRender: number = 0;
  drawCollisions: boolean = true;

  constructor(canvas: HTMLCanvasElement, physics: Physics) {
    this.physics = physics;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  public render() {
    let fps = null;
    if (this.previousRender) {
      const delta = (Date.now() - this.previousRender)/1000;
      fps = Math.floor(1 / delta);
    }
    this.previousRender = Date.now();

    this.context.fillStyle = this.background;
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    if (fps) {
      this.context.fillStyle = "#00F";
      this.context.strokeStyle = "#000";
      this.context.font = 'bold 20px sans-serif';
      this.context.strokeText(`${fps}fps`, 5, 25);
    }

    this.context.save();

    // Point 0, 0 to center of screen
    this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2);
    // this.context.scale(30, 30);
    //
    // this.context.translate(-this.viewport.x, -this.viewport.y);
    //
    // Рисуем физику
    for (let r = 0; r < this.physics.world.bodies.length; r++) {
      const body = this.physics.world.bodies[r];

      this.context.save();
      this.context.translate(body.position.x, body.position.y);
      this.context.rotate(body.orientation);

      this.context.fillStyle = '#f00';
      // if (physics.collisions.find(c => c.obj1 === object || c.obj2 === object)) {
      //   // Подкрасим столкнувшиеся элементы
      //   context.fillStyle = '#0ff';
      // }

      this.context.strokeStyle = '#000';
      this.context.lineWidth = 1;
      body.shape.draw(this.context);

      this.context.restore();
    }

    // Draw collisions
    if (this.drawCollisions) {
      for (let r = 0; r < this.physics.world.collidedBodies.length; r++) {
        const {collision} = this.physics.world.collidedBodies[r];

        this.context.save();
        this.context.translate(collision.vertex.x, collision.vertex.y);

        this.context.strokeStyle = '#00F';
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.moveTo(0, 0);
        const v = collision.normal.mult(-collision.penetrationDepth);
        this.context.lineTo(v.x, v.y);
        this.context.stroke();
        this.context.closePath();

        this.context.restore();
      }
    }

    // for (let r = 0; r < physics.collisions.length; r++) {
    //   const collision: Collision = physics.collisions[r];
    //
    //   context.save();
    //   context.translate(collision.position.x, collision.position.y);
    //
    //   context.beginPath();
    //   context.fillStyle = '#0f0';
    //   context.strokeStyle = '#0f0';
    //   context.ellipse(0, 0, 0.2, 0.2, 0, 0, 2 * Math.PI);
    //   context.fill();
    //   context.stroke();
    //
    //
    //   context.strokeStyle = '#000';
    //   context.lineWidth = 0.1;
    //   context.beginPath();
    //   context.moveTo(0, 0);
    //   // const obj1collisionVelocity = collision.obj1.getPointVelocity(collision.position);
    //   // const obj2collisionVelocity = collision.obj2.getPointVelocity(collision.position);
    //   // let vRelativeVelocity = obj2collisionVelocity.subtract(obj1collisionVelocity);
    //   //
    //   // context.lineTo(vRelativeVelocity.x, vRelativeVelocity.y);
    //   context.lineTo(collision.normal.x, collision.normal.y);
    //   context.stroke();
    //
    //   context.restore();
    // }

    this.context.restore();
  }

  static animate(renderer: Renderer) {
    renderer.render();

    requestAnimationFrame(() => Renderer.animate(renderer));
  }

  static run(renderer: Renderer) {
    Renderer.animate(renderer);
  }
}