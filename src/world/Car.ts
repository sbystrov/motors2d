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
    const orientation = tire.state.orientation + this.state.orientation;
    const relativeSpeed = this.state.velocity.getMagnitude() * Math.sin(orientation);
    steeringVector.setDirection(tire.state.orientation + Math.PI * Math.sign(tire.state.orientation));
    steeringVector.multiplyBy(relativeSpeed * this.mass / (secondsPassed ^ 2));
    console.log('steeringVector speed', steeringVector);

    this.addForce({
      point: this.frontLeftTire.state.position,
      force: steeringVector
    });
  }

  public enumerateForces(secondsPassed: number) {
    super.enumerateForces(secondsPassed);

    if (this.throttle) {
      // const force = new Vector(1, 0);
      // force.setDirection(this.state.orientation);
      // force.setMagnitude(this.throttle * 7354.9 * (secondsPassed ^ 2));
      //
      // // Apply throttle
      // this.addForce({
      //   point: this.backLeftTire.state.position,
      //   force: force
      // });
      // this.addForce({
      //   point: this.backRightTire.state.position,
      //   force: force
      // });
    }

    this.state.velocity = new Vector(10, 0);

    // Apply steering
    this.addTireForce(this.frontLeftTire, secondsPassed);
  }

  public nextState(world: World, delta: number): PhysicalState {
    const res: PhysicalState = super.nextState(world, delta);

    let isOnRoad = false;
    for (let r = 0; r < world.roads.length; r++) {
      if (world.roads[r].contains(res.position)) {
        isOnRoad = true;
      }
    }
    // res.velocity.setDirection(res.velocity.getDirection() + this.frontLeftTire.state.orientation * delta);
    // res.orientation = res.velocity.getDirection();
    // res.velocity = res.velocity.multiply(isOnRoad ? 0.99 : 0.9);

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

    // this.state.angularVelocity *= 0.9;

    if (controller.left) {
      this.steer(-0.05);
    } else if (controller.right) {
      this.steer(0.05);
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
  };
}