import {RigidObject} from "./RigidObject";
import {PhysicalState} from "./PhysicalState";
import {Controller} from "../Controller";
import {World} from "./World";
import {Vector} from "../utils/Vector";
import {Drawable} from "../Renderer";

export class Car extends RigidObject implements Drawable {
  frontLeftTire: RigidObject;
  frontRightTire: RigidObject;
  backLeftTire: RigidObject;
  backRightTire: RigidObject;

  throttle: number = 0.0;

  constructor() {
    super();

    // Toyota supra
    this.width = 4.661;
    this.height = 1.72;
    this.mass = 1361;

    const TIRE_WIDTH = 0.8;
    const TIRE_HEIGHT = 0.2;

    this.frontLeftTire = new RigidObject();
    this.frontLeftTire.width = TIRE_WIDTH;
    this.frontLeftTire.height = TIRE_HEIGHT;
    this.frontLeftTire.state.position = new Vector(this.width / 2 - TIRE_WIDTH, - this.height / 2 + TIRE_HEIGHT / 2);

    this.frontRightTire = new RigidObject();
    this.frontRightTire.width = TIRE_WIDTH;
    this.frontRightTire.height = TIRE_HEIGHT;
    this.frontRightTire.state.position = new Vector(this.width / 2 - TIRE_WIDTH, this.height / 2 - TIRE_HEIGHT / 2);

    this.backLeftTire = new RigidObject();
    this.backLeftTire.width = TIRE_WIDTH;
    this.backLeftTire.height = TIRE_HEIGHT;
    this.backLeftTire.state.position = new Vector(-this.width / 2 + TIRE_WIDTH, -this.height / 2 + TIRE_HEIGHT / 2);

    this.backRightTire = new RigidObject();
    this.backRightTire.width = TIRE_WIDTH;
    this.backRightTire.height = TIRE_HEIGHT;
    this.backRightTire.state.position = new Vector(- this.width / 2 + TIRE_WIDTH, this.height / 2 - TIRE_HEIGHT / 2);
  }

  private addTireForce(tire: RigidObject, secondsPassed: number) {
    const steeringVector = new Vector(1, 0);
    const relativeSpeed = this.state.velocity.copy();
    relativeSpeed.rotateBy(-this.state.orientation);
    const rotationSpeed = tire.state.position.rotate(Math.PI / 2).multiply(this.state.angularVelocity);
    relativeSpeed.addTo(rotationSpeed);
    relativeSpeed.multiplyBy(-1);

    steeringVector.setDirection(tire.state.orientation + Math.PI * (Math.sign(tire.state.orientation) || 1) / 2);

    const projection = relativeSpeed.dotProduct(steeringVector);
    steeringVector.multiplyBy(projection);

    steeringVector.multiplyBy(this.mass * tire.state.position.getMagnitude() ^ 2 / secondsPassed);

    const kTren = tire.isGliding ? 0.5 : 0.9;
    const maxForce = kTren * this.mass * 1000 / 4 * tire.height ^ 2;
    if (maxForce < steeringVector.getMagnitude()) {
      console.log('maxForce', maxForce, steeringVector.getMagnitude());
      steeringVector.setMagnitude(maxForce);
      tire.isGliding = true;
    } else {
      tire.isGliding = false;
    }

    this.addForce({
      point: tire.state.position,
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
        point: this.backLeftTire.state.position,
        force: force
      });
      this.addForce({
        point: this.backRightTire.state.position,
        force: force
      });
    }

    // this.state.velocity = new Vector(10, 0);
    // this.state.orientation = -Math.PI / 3;
    // this.state.angularVelocity = 3;

    // Apply steering
    this.addTireForce(this.frontLeftTire, secondsPassed);
    this.addTireForce(this.frontRightTire, secondsPassed);
    this.addTireForce(this.backLeftTire, secondsPassed);
    this.addTireForce(this.backRightTire, secondsPassed);
  }

  public nextState(world: World, delta: number): PhysicalState {
    const res: PhysicalState = super.nextState(world, delta);

    let isOnRoad = false;
    for (let r = 0; r < world.roads.length; r++) {
      if (world.roads[r].contains(res.position)) {
        isOnRoad = true;
      }
    }

    return res;
  }

  private steer(angle: number) {
    let newSteering = this.frontLeftTire.state.orientation + angle;
    this.frontLeftTire.state.orientation = Math.sign(newSteering) * Math.min(Math.abs(newSteering), Math.PI / 4);
    this.frontRightTire.state.orientation = this.frontLeftTire.state.orientation;
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
    } else if (this.frontLeftTire.state.orientation !== 0) {
      this.steer(-this.frontLeftTire.state.orientation / 10);
    }
  }

  // Drawable interface
  drawTire(context: CanvasRenderingContext2D, tire: RigidObject) {
    context.save();
    context.translate(
      tire.state.position.x,
      tire.state.position.y
    );
    context.rotate(tire.state.orientation);
    context.fillRect(-tire.width / 2, -tire.height / 2, tire.width, tire.height);
    context.restore();
  }

  render(context: CanvasRenderingContext2D) {
    context.translate(this.state.position.x, this.state.position.y);
    context.rotate(this.state.orientation); // in the screenshot I used angle = 20

    context.fillStyle = '#f00';
    context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Draw tires
    context.fillStyle = '#0f0';

    context.save();
    context.fillStyle = '#0f0';
    this.drawTire(context, this.frontLeftTire);
    this.drawTire(context, this.frontRightTire);
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