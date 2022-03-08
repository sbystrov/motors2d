import {Vector} from "../utils/Vector";
import {Physics2d} from "./Physics2d";
import {Shape} from "./shape/Shape";

type AppliedForce = {
  point: Vector;
  force: Vector;
}

export class RigidObject {
  position: Vector = new Vector(0,0);
  orientation: number = 0;
  velocity: Vector = new Vector(0,0);
  angularVelocity: number = 0;
  shape: Shape;

  mass = 1;

  appliedForces: AppliedForce[] = [];
  force: Vector = new Vector(0, 0);
  momentum: number = 0;

  constructor(shape: Shape, mass: number, position: Vector, velocity: Vector, orientation: number, angularVelocity: number) {
    this.shape = shape;
    this.mass = mass;
    this.position = position;
    this.velocity = velocity;
    this.orientation = orientation;
    this.angularVelocity = angularVelocity;
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
    this.velocity.addTo(this.force.rotate(this.orientation).multiply(secondsPassed / this.mass));
    this.angularVelocity += this.momentum * secondsPassed;
  }

  public getPointVelocity(point: Vector) {
    const pointSpeed = this.velocity.copy();
    const relativePosition = point.subtract(this.position);

    // relativeSpeed.rotateBy(-this.orientation);
    const rotationSpeed = relativePosition.rotate(Math.PI / 2).multiply(this.angularVelocity);
    // relativeSpeed.addTo(rotationSpeed);
    // relativeSpeed.multiplyBy(-1);

    return pointSpeed.add(rotationSpeed);
  }

  public update(physics2d: Physics2d, secondsPassed: number) {
    this.position = this.position.add(this.velocity.multiply(secondsPassed));
    this.orientation = this.orientation + this.angularVelocity * secondsPassed;
  }

  public draw(context:CanvasRenderingContext2D) {
    this.shape.draw(context);

    // Draw forces
    this.appliedForces.forEach(f => {
      const force = new Vector(f.force.x, f.force.y);
      force.multiplyBy(1/this.mass);

      context.strokeStyle = '#000';
      context.lineWidth = 0.1;
      context.beginPath();
      context.moveTo(f.point.x, f.point.y);
      context.lineTo(f.point.x + force.x, f.point.y + force.y);
      context.stroke();
    })
  }
}