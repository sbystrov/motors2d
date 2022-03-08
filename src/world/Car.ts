import {RigidObject} from "../physics2d/RigidObject";
import {Controller} from "../Controller";
import {Vector} from "../utils/Vector";
import {Physics2d} from "../physics2d/Physics2d";
import {RectShape} from "../physics2d/shape/RectShape";

const TIRE_WIDTH = 0.8;
const TIRE_HEIGHT = 0.2;

export class Car extends RigidObject {
  frontLeftTire: Vector;
  frontRightTire: Vector;
  backLeftTire: Vector;
  backRightTire: Vector;

  throttle: number = 0.0;
  steering: number = 0.0;

  constructor() {
    super(
      new RectShape(4.661, 1.72),
      1361,
      new Vector(0,0),
      new Vector(0,0),
      0,
      0
    );

    // Toyota supra
    const shape = this.shape as RectShape;

    this.frontLeftTire = new Vector(shape.width / 2 - TIRE_WIDTH, - shape.height / 2 + TIRE_HEIGHT / 2);
    this.frontRightTire = new Vector(shape.width / 2 - TIRE_WIDTH, shape.height / 2 - TIRE_HEIGHT / 2);
    this.backLeftTire = new Vector(-shape.width / 2 + TIRE_WIDTH, -shape.height / 2 + TIRE_HEIGHT / 2);
    this.backRightTire = new Vector(- shape.width / 2 + TIRE_WIDTH, shape.height / 2 - TIRE_HEIGHT / 2);
  }

  private addTireForce(tire: Vector, secondsPassed: number, direction?: number) {
    const steeringVector = new Vector(1, 0);
    const relativeSpeed = this.velocity.copy();
    relativeSpeed.rotateBy(-this.orientation);
    const rotationSpeed = tire.rotate(Math.PI / 2).multiply(this.angularVelocity);
    relativeSpeed.addTo(rotationSpeed);
    relativeSpeed.multiplyBy(-1);

    // steeringVector.setDirection(tire.state.orientation + Math.PI * (Math.sign(tire.state.orientation) || 1) / 2);
    steeringVector.setDirection(direction + Math.PI * (Math.sign(direction) || 1) / 2);

    const projection = relativeSpeed.dotProduct(steeringVector);
    steeringVector.multiplyBy(projection);

    steeringVector.multiplyBy(this.mass * tire.getMagnitude() ^ 2 / (secondsPassed ^ 2));

    // const kTren = tire.isGliding ? 0.5 : 0.9;
    // const maxForce = kTren * this.mass * 1000 / 4 * TIRE_HEIGHT ^ 2;
    // if (maxForce < steeringVector.getMagnitude()) {
    //   steeringVector.setMagnitude(maxForce);
    //   tire.isGliding = true;
    // } else {
    //   tire.isGliding = false;
    // }

    this.addForce({
      point: tire,
      force: steeringVector
    });

    // this.addForce({
    //   point: this.frontLeftTire.state.position,
    //   force: relativeSpeed
    // });
  }

  public enumerateForces(secondsPassed: number) {
    super.enumerateForces(secondsPassed);

    if (this.throttle) {
      const force = new Vector(1, 0);
      // force.setDirection(this.state.orientation);
      force.setMagnitude(this.throttle * 7354.9 * (secondsPassed ^ 2));

      // Apply throttle
      this.addForce({
        point: this.backLeftTire,
        force: force.multiply(0.5)
      });
      this.addForce({
        point: this.backRightTire,
        force: force.multiply(0.5)
      });
    }

    // this.state.velocity = new Vector(10, 0);
    // this.state.orientation = -Math.PI / 3;
    // this.state.angularVelocity = 3;

    // Apply steering
    this.addTireForce(this.frontLeftTire, secondsPassed, this.steering);
    this.addTireForce(this.frontRightTire, secondsPassed, this.steering);
    this.addTireForce(this.backLeftTire, secondsPassed, 0);
    this.addTireForce(this.backRightTire, secondsPassed,0);
  }

  public update(physics2d: Physics2d, delta: number) {
    super.update(physics2d, delta);

    // let isOnRoad = false;
    // for (let r = 0; r < world.roads.length; r++) {
    //   if (world.roads[r].contains(res.position)) {
    //     isOnRoad = true;
    //   }
    // }
  }

  private steer(angle: number) {
    let newSteering = this.steering + angle;
    this.steering = Math.sign(newSteering) * Math.min(Math.abs(newSteering), Math.PI / 4);
  }

  public applyController(controller: Controller) {
    if (controller.up) {
      this.throttle = 1;
    } else if (controller.down) {
      this.throttle = -1;
    } else {
      this.throttle = 0;
    }

    if (controller.left) {
      this.steer(-0.02);
    } else if (controller.right) {
      this.steer(0.02);
    } else if (this.steering !== 0) {
      this.steering = Math.sign(this.steering) * (Math.abs(this.steering) - Math.min(0.02, Math.abs(this.steering)));
    }
  }

  // Drawable interface
  drawTire(context: CanvasRenderingContext2D, tire: Vector, direction?: number) {
    context.save();
    context.translate(
      tire.x,
      tire.y
    );
    context.rotate(direction || 0);
    context.fillRect(-TIRE_WIDTH / 2, -TIRE_HEIGHT / 2, TIRE_WIDTH, TIRE_HEIGHT);
    context.restore();
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = '#f00';
    super.draw(context);

    // Draw tires
    context.fillStyle = '#0f0';

    context.save();
    context.fillStyle = '#0f0';
    this.drawTire(context, this.frontLeftTire, this.steering);
    this.drawTire(context, this.frontRightTire, this.steering);
    context.fillStyle = '#00f';
    this.drawTire(context, this.backLeftTire);
    this.drawTire(context, this.backRightTire);
    context.restore();

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
  };
}