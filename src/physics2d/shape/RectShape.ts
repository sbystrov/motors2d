import {Shape} from "./Shape";

export class RectShape extends Shape {
  width: number = 5;
  height: number = 5;

  public draw(context:CanvasRenderingContext2D) {
    context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }
}