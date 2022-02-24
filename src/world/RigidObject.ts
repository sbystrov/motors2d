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

  appliedForces: AppliedForce[] = [];

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
    const force = new Vector(0,0);
    let momentum = 0;

    for (let i = 0; i<this.appliedForces.length; i++) {
      const appliedForce = this.appliedForces[i];

      force.addTo(appliedForce.force);

      const perpendicular = new Vector(-appliedForce.point.y, appliedForce.point.x);
      perpendicular.normalize();
      const momentumForce = perpendicular.copy();
      momentumForce.setMagnitude(perpendicular.dotProduct(appliedForce.force));

      // const momentumForce = perpendicular.multiply(perpendicular.dotProduct(appliedForce.force) / appliedForce.force.dotProduct(appliedForce.force));
      momentumForce.rotateBy(-appliedForce.point.getDirection());

      console.log('-------');

      console.log('appliedForce', appliedForce.force);
      // console.log('perpendicular', perpendicular);
      // console.log('appliedForce.point.getDirection()', appliedForce.point.getDirection(), appliedForce.point);
      console.log('momentumForce', momentumForce);
      // console.log(appliedForce.point.getDirection() - perpendicular.getDirection());

      momentum += Math.sign(momentumForce.y) * momentumForce.getMagnitude() / (this.mass * (appliedForce.point.getMagnitude() ^ 2));
    }


    // Now change speed and angular velocity
    this.state.velocity.addTo(force.multiply(secondsPassed / this.mass));
    this.state.angularVelocity += momentum * secondsPassed;
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