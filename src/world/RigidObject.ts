import {PhysicalState} from "./PhysicalState";
import {World} from "./World";
import {Vector} from "../utils/Vector";

type AppliedForce = {
  point: Vector;
  force: Vector;
}

export class RigidObject {
  state: PhysicalState = new PhysicalState();
  width = 1;
  height = 1;
  mass = 1;

  isGliding: boolean = false;

  appliedForces: AppliedForce[] = [];
  force: Vector = new Vector(0, 0);
  momentum: number = 0;

  public setState(newState: PhysicalState) {
    this.state = newState;
  }

  public addForce(appliedForce: AppliedForce) {
    this.appliedForces.push(appliedForce);
  }

  public enumerateForces(secondsPassed: number) {
    this.appliedForces = [];
  }

  public applyForces(secondsPassed: number) {
    this.force = new Vector(0,0);
    this.momentum = 0;

    for (let i = 0; i<this.appliedForces.length; i++) {
      const appliedForce = this.appliedForces[i];

      this.force.addTo(appliedForce.force);

      const perpendicular = new Vector(-appliedForce.point.y, appliedForce.point.x);
      perpendicular.normalize();
      const momentumForce = perpendicular.copy();
      momentumForce.setMagnitude(perpendicular.dotProduct(appliedForce.force));

      // const momentumForce = perpendicular.multiply(perpendicular.dotProduct(appliedForce.force) / appliedForce.force.dotProduct(appliedForce.force));
      momentumForce.rotateBy(-appliedForce.point.getDirection());
      this.momentum += Math.sign(momentumForce.y) * momentumForce.getMagnitude() / (this.mass * (appliedForce.point.getMagnitude() ^ 2));
    }

    // Now change speed and angular velocity
    this.state.velocity.addTo(this.force.rotate(this.state.orientation).multiply(secondsPassed / this.mass));
    this.state.angularVelocity += this.momentum * secondsPassed;
  }

  public nextState(world: World, secondsPassed: number): PhysicalState {
    const res: PhysicalState = {
      velocity: this.state.velocity.copy(),
      position: this.state.position.copy(),
      orientation: this.state.orientation,
      angularVelocity: this.state.angularVelocity
    };
    res.position = res.position.add(res.velocity.multiply(secondsPassed));
    res.orientation = res.orientation + res.angularVelocity * secondsPassed;

    return res;
  }
}