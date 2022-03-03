import {World} from "./world/World";
import {Road} from "./world/roads/Road";
import {Vector} from "./utils/Vector";
import {Physics2d} from "./physics2d/Physics2d";
import {RigidObject} from "./physics2d/RigidObject";
import {Collision} from "./physics2d/Collision";

const imagesToLoad = {
  'dirt': '/ground.jpeg',
  'tarmac': '/tarmac.png',
  'car': '/car.png',
}

export type Viewport = Vector;

export interface Drawable {
  render(context: CanvasRenderingContext2D): void;
}

export class Renderer {
  context: CanvasRenderingContext2D;
  images: { [key: string]: HTMLImageElement } = {};
  viewport: Viewport = new Vector(0, 0);
  previousRender: number = 0;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public loadResources() {
    const images = this.images;
    Object.keys(imagesToLoad).forEach(key => {
      const img = new Image();      // First create the image...
      img.onload = function () {  // ...then set the onload handler...
        images[key] = img;
      };
      img.src = imagesToLoad[key];
    })
  }

  public setViewport(viewport: Viewport) {
    this.viewport = viewport;
  }

  public render(world: World, physics: Physics2d) {
    let fps = null;
    if (this.previousRender) {
      const delta = (Date.now() - this.previousRender)/1000;
      fps = Math.floor(1 / delta);
    }
    this.previousRender = Date.now();

    this.context.fillStyle = "#201A23";
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height); // x, y, width, height

    if (fps) {
      this.context.fillStyle = "#00F";
      this.context.strokeStyle = "#FFF";
      this.context.font = 'bold 20px sans-serif';
      this.context.strokeText(`${fps}fps`, 5, 40);
    }

    this.context.save();

    this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2);
    this.context.scale(30, 30);

    this.context.translate(-this.viewport.x, -this.viewport.y);

    // Render ground
    const tile_width = 128;
    const tile_height = 128;
    for (let x = 0; x < world.size; x++) {
      for (let y = 0; y < world.size; y++) {

        const img = this.images[world.ground[x + y * world.size]];
        if (img) {
          this.context.drawImage(img, x * tile_width, y * tile_height, tile_width, tile_height);
        }
      }
    }

    // Render roads
    const ctx = this.context;
    ctx.fillStyle = '#888';

    for (let r = 0; r < world.roads.length; r++) {
      const road: Road = world.roads[r];

      for (let t = 0; t < road.tiles.length; t++) {
        const tile = road.tiles[t];
        ctx.beginPath();
        ctx.moveTo(tile.p0.x, tile.p0.y);
        ctx.lineTo(tile.p1.x, tile.p1.y);
        ctx.lineTo(tile.p2.x, tile.p2.y);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Рисуем физику
    const context = this.context;
    for (let r = 0; r < physics.dynamicObjects.length; r++) {
      const object: RigidObject = physics.dynamicObjects[r];

      context.save();
      context.translate(object.position.x, object.position.y);
      context.rotate(object.orientation);

      context.fillStyle = '#f00';
      if (physics.collisions.find(c => c.obj1 === object || c.obj2 === object)) {
        // Подкрасим столкнувшиеся элементы
        context.fillStyle = '#0ff';
      }

      context.strokeStyle = '#0ff';
      object.draw(context);

      context.restore();
    }

    for (let r = 0; r < physics.collisions.length; r++) {
      const collision: Collision = physics.collisions[r];

      context.save();
      context.translate(collision.position.x, collision.position.y);

      context.beginPath();
      context.fillStyle = '#0f0';
      context.strokeStyle = '#0f0';
      context.ellipse(0, 0, 0.2, 0.2, 0, 0, 2 * Math.PI);
      context.fill();
      context.stroke();

      context.restore();
    }


    this
      .context
      .restore();
  }
}