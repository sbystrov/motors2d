import {Entity} from "./Entity";
import {EntityState} from "./EntityState";
import {Controller} from "../Controller";
import {World} from "./World";

export class Car extends Entity{
  public nextState(world: World): EntityState {
    const res: EntityState = super.nextState(world);

    const tX = Math.floor(res.x / 128);
    const tY = Math.floor(res.y / 128);

    const groundType = world.ground[tX + tY * world.size];

    res.velocity *= groundType === 'tarmac' ? 0.99 : 0.9;
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