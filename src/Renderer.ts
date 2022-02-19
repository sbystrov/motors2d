import {World} from "./world/World";

const imagesToLoad = {
  'dirt': '/ground.png',
  'tarmac': '/tarmac.png',
  'car': '/car.png',
}

export type Viewport = {
  x: number;
  y: number;
}

export class Renderer {
  context: CanvasRenderingContext2D;
  images: { [key: string]: HTMLImageElement } = {};
  viewport: Viewport = {x: 0, y: 0};

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
    this.context.fillStyle = "#201A23";
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height); // x, y, width, height

    this.context.save();

    this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2);
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

    const carImage = this.images['car'];

    if (carImage) {
      world.entities.forEach(e => {
        this.context.save();
        this.context.translate(e.state.x, e.state.y);
        this.context.rotate(e.state.direction + Math.PI / 2); // in the screenshot I used angle = 20

        this.context.drawImage(carImage, -e.width / 2, -e.height / 2, e.width, e.height);

        this.context.restore();
      })
    }

    this
      .context
      .restore();
  }
}