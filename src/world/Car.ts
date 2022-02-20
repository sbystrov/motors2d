import {Entity} from "./Entity";
import {EntityState} from "./EntityState";
import {Controller} from "../Controller";
import {World} from "./World";
import {Vector} from "../utils/Vector";

export class Car extends Entity{
  constructor() {
    super();

    // Toyota supra
    this.width = 1.72;
    this.height = 4.661;
  }

  public nextState(world: World): EntityState {
    const res: EntityState = super.nextState(world);

    let isOnRoad = false;
    for (let r = 0; r < world.roads.length; r++) {
      if (world.roads[r].contains(new Vector(res.x, res.y))) {
        isOnRoad = true;
      }
    }

    res.velocity *= isOnRoad ? 0.99 : 0.9;
    res.angularVelocity *= 0.9;

    if (Math.abs(res.angularVelocity) > 0.015 ) {
      res.angularVelocity = Math.sign(res.angularVelocity) * 0.015;
    }

    return res;
  }

  public applyController(controller: Controller) {
    if (controller.up) {
      this.state.velocity += 0.2;
    }
    if (controller.down) {
      this.state.velocity -= 0.2;
    }

    if (controller.left) {
      this.state.angularVelocity += -0.005;
    }

    if (controller.right) {
      this.state.angularVelocity += 0.005;
    }
  }
}