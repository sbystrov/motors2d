import {Shape} from "./shape/Shape";
import {Vector} from './Vector';

type AppliedForce = {
  point: Vector;
  force: Vector;
}

export class RigidBody {
  position: Vector = new Vector(0, 0);
  orientation: number = 0;
  velocity: Vector = new Vector(0, 0);
  angularVelocity: number = 0;
  shape: Shape;

  mass = 1;
  invertedMass = 1 / this.mass;

  elasticity = 0.3;
  staticFriction = 0.3;
  dynamicFriction = 0.2;

  invertedInertia: number;

  appliedForces: AppliedForce[] = [];
  force: Vector = new Vector(0, 0);
  momentum: number = 0;

  constructor(shape: Shape) {
    this.shape = shape;
  }

  public momentOfInertia() {
    return this.shape.momentOfInertia(this.mass);
  }

  public addForce(appliedForce: AppliedForce) {
    this.appliedForces.push(appliedForce);
  }

  public enumerateForces(secondsPassed: number) {
    this.appliedForces = [];
    // this.addForce({
    //   point: Vector.create(),
    //   force: Vector.fromValues(0, 9.8 * this.mass).rotate(-this.orientation)
    // })
  }

  public applyForces(secondsPassed: number) {
    // this.force = Vector.create();
    // this.momentum = 0;
    //
    // for (let i = 0; i<this.appliedForces.length; i++) {
    //   const appliedForce = this.appliedForces[i];
    //
    //   this.force.addTo(appliedForce.force);
    //
    //   const perpendicular = new Vector(-appliedForce.point.y, appliedForce.point.x);
    //   perpendicular.normalize();
    //   const momentumForce = perpendicular.copy();
    //   momentumForce.setMagnitude(perpendicular.dotProduct(appliedForce.force));
    //
    //   // const momentumForce = perpendicular.multiply(perpendicular.dotProduct(appliedForce.force) / appliedForce.force.dotProduct(appliedForce.force));
    //   momentumForce.rotateBy(-appliedForce.point.getDirection());
    //   if (appliedForce.point.getMagnitude() > 0) {
    //     this.momentum += Math.sign(momentumForce.y) * momentumForce.getMagnitude() / (this.mass * (appliedForce.point.getMagnitude() ^ 2));
    //   }
    // }
    //
    // // Now change speed and angular velocity
    // if (this.mass) {
    //   this.velocity.addTo(this.force.rotate(this.orientation).multiply(secondsPassed / this.mass));
    //   this.angularVelocity += this.momentum * secondsPassed;
    // }
  }

  public getPointVelocity(point: Vector) {
    // const pointSpeed = this.velocity.copy();
    // const relativePosition = point.subtract(this.position);
    //
    // const rotationSpeed = relativePosition.rotate(Math.PI / 2).multiply(this.angularVelocity);
    //
    // return pointSpeed.add(rotationSpeed);
  }

  public draw(context:CanvasRenderingContext2D) {
    this.shape.draw(context);

    // // Draw forces
    // this.appliedForces.forEach(f => {
    //   const force = new Vector(f.force.x, f.force.y);
    //   force.multiplyBy(1/this.mass);
    //
    //   context.strokeStyle = '#000';
    //   context.lineWidth = 0.1;
    //   context.beginPath();
    //   context.moveTo(f.point.x, f.point.y);
    //   context.lineTo(f.point.x + force.x, f.point.y + force.y);
    //   context.stroke();
    // })
  }

  public setMass(mass: number) {
    this.mass = mass;

    this.invertedMass = null;
    this.invertedInertia = null;
  }

  public getInvertedInertia() {
    if (!this.invertedInertia) {
      this.invertedInertia = this.mass === 0 ? 0 : 1 / this.shape.momentOfInertia(this.mass);
    }
    return this.invertedInertia;
  }

  public getInvertedMass() {
    if (this.invertedMass === null) {
      this.invertedMass = this.mass === 0 ? 0 : 1 / this.mass;
    }
    return this.invertedMass;
  }
}