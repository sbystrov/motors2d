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
      e.enumerateForces(secondsPassed);
    });
    this.detectCollisions(secondsPassed);
    this.dynamicObjects.forEach(e => {
      e.applyForces(secondsPassed);
      e.update(this, secondsPassed);
    });
  }

  private detectCollisions = (secondsPassed: number) => {
    this.collisions = [];
    // Start checking for collisions
    for (let i = 0; i < this.dynamicObjects.length; i++)
    {
      const obj1 = this.dynamicObjects[i];
      for (let j = i + 1; j < this.dynamicObjects.length; j++)
      {
        const obj2 = this.dynamicObjects[j];

        // Compare object1 with object2
        const collisionPosition = detectCollision(obj1, obj2);
        if (collisionPosition){
          const collisionVector = obj2.position.subtract(obj1.position);
          collisionVector.normalize();

          const collision = new Collision();
          collision.obj1 = obj1;
          collision.obj2 = obj2;
          collision.position = collisionPosition;
          collision.direction = collisionVector;

          this.collisions.push(collision);
          const obj1collisionVelocity = obj1.getPointVelocity(collisionPosition).multiply(1000);
          const obj2collisionVelocity = obj2.getPointVelocity(collisionPosition);


          //
          let vRelativeVelocity = obj2collisionVelocity.subtract(obj1collisionVelocity);
          let speed = vRelativeVelocity.x * collisionVector.x + vRelativeVelocity.y * collisionVector.y;
          // if (speed < 0) {
          //   continue;
          // }
          //
          let impulse = 2 * speed / (obj1.mass + obj2.mass);


          // collisionVector.setMagnitude(impulse * obj2.mass);
          // obj1.velocity.subtractFrom(collisionVector);
          // collisionVector.setMagnitude(impulse * obj1.mass);
          // obj2.velocity.addTo(collisionVector);

          vRelativeVelocity.normalize()
          // obj1.addForce({
          //   point: collisionPosition,
          //   force: vRelativeVelocity.multiply(impulse * obj2.mass / secondsPassed ^ 2)
          // })
          // obj1.addForce({
          //   point: collisionPosition,
          //   force: vRelativeVelocity.multiply(-impulse * obj1.mass / secondsPassed ^ 2)
          // })
          // debugger;

        }
      }
    }
  }
}