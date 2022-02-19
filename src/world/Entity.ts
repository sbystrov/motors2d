import {EntityState} from "./EntityState";
import {World} from "./World";

export class Entity {
  state: EntityState = new EntityState();
  width = 32;
  height = 32;

  public setState(newState: EntityState) {
    this.state = newState;
  }

  public nextState(world: World): EntityState {
    const res: EntityState = {...this.state};
    res.x += res.velocity * Math.cos(res.direction);
    res.y += res.velocity * Math.sin(res.direction);

    res.direction += res.angularVelocity;

    return res;
  }
}