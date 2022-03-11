import {Triangle} from "../../utils/Triangle";
import {Vector} from "../../utils/Vector";

export class Road {
  tiles: Triangle[] = [];
  fence0: Vector[] = [];
  fence1: Vector[] = [];

  public addTile(tile: Triangle) {
    this.tiles.push(tile);
  }

  public contains(point: Vector) {
    for (let i=0; i < this.tiles.length; i++) {
      if (this.tiles[i].contains(point)) {
        return true;
      }
    }

    return false;
  }
}