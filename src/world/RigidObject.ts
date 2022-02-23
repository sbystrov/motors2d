import {PhysicalState} from "./PhysicalState";
import {World} from "./World";

export class RigidObject {
  state: PhysicalState = new PhysicalState();
  width = 32;
  height = 32;

  public setState(newState: PhysicalState) {
    this.state = newState;
  }

  public nextState(world: World, delta: number): PhysicalState {
    const res: PhysicalState = {
      velocity: this.state.velocity.copy(),
      position: this.state.position.copy(),
      orientation: this.state.orientation,
      angularVelocity: this.state.angularVelocity
    };
    res.position = res.position.add(res.velocity.multiply(delta));
    res.orientation = res.orientation + res.angularVelocity * delta;

    return res;
  }
}