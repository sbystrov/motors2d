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

  steering: number = 0.0;

  constructor() {
    super();

    // Toyota supra
    this.width = 1.72;
    this.height = 4.661;

    const TIRE_WIDTH = 0.2;
    const TIRE_HEIGHT = 0.8;

    this.frontLeftTire = new RigidObject();
    this.frontLeftTire.width = TIRE_WIDTH;
    this.frontLeftTire.height = TIRE_HEIGHT;
    this.frontLeftTire.state.position = new Vector(-this.width / 2 + TIRE_WIDTH / 2,this.height / 2 - TIRE_HEIGHT);

    this.frontRightTire = new RigidObject();
    this.frontRightTire.width = TIRE_WIDTH;
    this.frontRightTire.height = TIRE_HEIGHT;
    this.frontRightTire.state.position = new Vector(this.width / 2 - TIRE_WIDTH / 2,this.height / 2 - TIRE_HEIGHT);

    this.backLeftTire = new RigidObject();
    this.backLeftTire.width = TIRE_WIDTH;
    this.backLeftTire.height = TIRE_HEIGHT;
    this.backLeftTire.state.position = new Vector(-this.width / 2 + TIRE_WIDTH / 2,-this.height / 2 + TIRE_HEIGHT);

    this.backRightTire = new RigidObject();
    this.backRightTire.width = TIRE_WIDTH;
    this.backRightTire.height = TIRE_HEIGHT;
    this.backRightTire.state.position = new Vector(this.width / 2 - TIRE_WIDTH / 2, -this.height / 2 + TIRE_HEIGHT);
  }

  public nextState(world: World, delta: number): PhysicalState {
    const res: PhysicalState = super.nextState(world, delta);

    let isOnRoad = false;
    for (let r = 0; r < world.roads.length; r++) {
      if (world.roads[r].contains(res.position)) {
        isOnRoad = true;
      }
    }

    res.velocity = res.velocity.multiply(isOnRoad ? 0.99 : 0.99);
    // res.angularVelocity *= 0.9;
    //
    // if (Math.abs(res.angularVelocity) > 0.015 ) {
    //   res.angularVelocity = Math.sign(res.angularVelocity) * 0.015;
    // }

    return res;
  }

  private steer(angle: number) {
    let newSteering = this.steering + angle;
    this.steering = Math.sign(newSteering) * Math.min(Math.abs(newSteering), Math.PI / 4);
  }

  public applyController(controller: Controller) {
    if (controller.up) {
      this.state.velocity.setMagnitude(this.state.velocity.getMagnitude() + 0.5);
    }
    if (controller.down) {
      this.state.velocity.setMagnitude(this.state.velocity.getMagnitude() - 0.5);
    }
    this.state.angularVelocity *= 0.9;

    if (controller.left) {
      this.steer(-0.05);
    } else if (controller.right) {
      this.steer(0.05);
    } else if (this.steering !== 0) {
      this.steer(-this.steering / 10);
    }
  }

  // Drawable interface
  drawTire(context: CanvasRenderingContext2D, tire: RigidObject) {
    context.save();
    context.translate(
      -tire.state.position.x,
      -tire.state.position.y
    );
    context.rotate(this.steering);
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