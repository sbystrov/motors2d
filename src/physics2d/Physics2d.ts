import {RigidObject} from "./RigidObject";
import {Collision, detectCollision} from "./Collision";

export class Physics2d {
  collisions: Collision[] = [];
  dynamicObjects: RigidObject[] = [];

  public addDynamicObject(object: RigidObject) {
    this.dynamicObjects.push(object);
  }

  public update = (secondsPassed: number) => {
    this.dynamicObjects.forEach(e => {
      e.setState(e.nextState(this, secondsPassed));
      e.enumerateForces(secondsPassed);
      e.applyForces(secondsPassed);
    });
    this.detectCollisions();
  }

  private detectCollisions = () => {
    this.collisions = [];
    // Start checking for collisions
    for (let i = 0; i < this.dynamicObjects.length; i++)
    {
      const obj1 = this.dynamicObjects[i];
      for (let j = i + 1; j < this.dynamicObjects.length; j++)
      {
        const obj2 = this.dynamicObjects[j];

        // Compare object1 with object2
        const collisionVector = detectCollision(obj1, obj2);
        if (collisionVector){
          const collision = new Collision();
          collision.obj1 = obj1;
          collision.obj2 = obj2;
          collision.direction = collisionVector;

          this.collisions.push(collision);

          let vRelativeVelocity = {x: obj1.state.velocity.x - obj2.state.velocity.x, y: obj1.state.velocity.y - obj2.state.velocity.y};
          let speed = vRelativeVelocity.x * collisionVector.x + vRelativeVelocity.y * collisionVector.y;
          if (speed < 0) {
            continue;
          }

          let impulse = 2 * speed / (obj1.mass + obj2.mass);

          collisionVector.setMagnitude(impulse * obj2.mass);
          obj1.state.velocity.subtractFrom(collisionVector);
          collisionVector.setMagnitude(impulse * obj1.mass);
          obj2.state.velocity.addTo(collisionVector);
        }
      }
    }
  }
}