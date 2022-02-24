import {World} from "./world/World";
import {Road} from "./world/roads/Road";
import {Vector} from "./utils/Vector";

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

  public render(world: World) {
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
    this.context.scale(20, 20);

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


    // Render car
    const carImage = this.images['car'];

    if (carImage) {
      world.entities.forEach(e => {
        this.context.save();

        // // this.context.drawImage(carImage, -e.width / 2, -e.height / 2, e.width, e.height);
        // this.context.fillStyle = '#f00';
        // this.context.fillRect(-e.width / 2, -e.height / 2, e.width, e.height);
        if ('render' in e) {
          (e as unknown as Drawable).render(this.context);
        }
        this.context.restore();
      })
    }

    this
      .context
      .restore();
  }
}