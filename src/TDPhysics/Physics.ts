import {World} from './World';
import {RigidBody} from './RigidBody';
import {Collider} from './collider/Collider';
import {Vector} from './Vector';

export class Physics {
  world: World = new World();
  lastTimestamp: number = 0;
  // collisions: Collision[] = [];

  public update = (secondsPassed: number) => {
    // this.dynamicObjects.forEach(e => {
    //   e.applyForces(secondsPassed);
    //   e.enumerateForces(secondsPassed);
    // });
    this.detectCollisions(secondsPassed);
    this.resolvePenetrations();
    this.resolveCollisions();
    this.world.bodies.forEach(e => {
      this.updatePositionAndOrientation(e, secondsPassed);
    });
  }

  private updatePositionAndOrientation(body: RigidBody, secondsPassed: number) {
    body.position = body.position.add(body.velocity.mult(secondsPassed));
    body.orientation = body.orientation + body.angularVelocity * secondsPassed;
  }

  //
  // private detectCollisions = (secondsPassed: number) => {
  //   this.collisions = [];
  //   // Start checking for collisions
  //   for (let i = 0; i < this.dynamicObjects.length; i++)
  //   {
  //     const obj1 = this.dynamicObjects[i];
  //     for (let j = i + 1; j < this.dynamicObjects.length; j++)
  //     {
  //       const obj2 = this.dynamicObjects[j];
  //       if (obj1.mass === 0 && obj2.mass === 0) {
  //         continue;
  //       }
  //
  //       // Compare object1 with object2
  //       const collision = detectCollision(obj1, obj2);
  //       if (collision){
  //         this.collisions.push(collision);
  //         // http://www.cs.uu.nl/docs/vakken/mgp/2016-2017/Lecture%203%20-%20Collisions.pdf
  //
  //         const coefficientOfRestitution = 0.3;
  //
  //         const A = vec3.fromValues(collision.obj1.position.x, collision.obj1.position.y, 0);
  //         const B = vec3.fromValues(collision.obj2.position.x, collision.obj2.position.y, 0);
  //         const p = vec3.fromValues(collision.position.x, collision.position.y, 0);
  //         const n = vec3.fromValues(collision.normal.x, collision.normal.y, 0);
  //         const wA = vec3.fromValues(0, 0, collision.obj1.angularVelocity);
  //         const wB = vec3.fromValues(0, 0, collision.obj2.angularVelocity);
  //         const rA = p.minus(A);
  //         const rB = p.minus(B);
  //         const wArA = wA.cross(rA);
  //         const wBrB = wB.cross(rB);
  //         const dividedMass1 = collision.obj1.mass === 0 ? 0 : 1 / collision.obj1.mass;
  //         const dividedMass2 = collision.obj2.mass === 0 ? 0 : 1 / collision.obj2.mass;
  //         const dividedMoment1 = collision.obj1.mass === 0 ? 0 : 1 / collision.obj1.momentOfInertia();
  //         const dividedMoment2 = collision.obj2.mass === 0 ? 0 : 1 / collision.obj2.momentOfInertia();
  //
  //         let vA = vec3.fromValues(collision.obj1.velocity.x, collision.obj1.velocity.y, 0);
  //         vA = vA.plus(wArA);
  //         let vB = vec3.fromValues(collision.obj2.velocity.x, collision.obj2.velocity.y, 0);
  //         vB = vB.plus(wBrB);
  //
  //         let angularImpulsePartV = rA.cross(n).scaled(dividedMoment1).cross(rA);
  //         angularImpulsePartV = angularImpulsePartV.plus(rB.cross(n).scaled(dividedMoment2).cross(rB));
  //         const angularImpulsePart = angularImpulsePartV.dot(n);
  //
  //         let j = -(1 + coefficientOfRestitution) * vA.minus(vB).dot(n);
  //         j = j / ((dividedMass1 + dividedMass2) + angularImpulsePart);
  //
  //         if (j < 0) {
  //           // Objects are going apart - ignore interaction
  //           continue;
  //         }
  //
  //         obj1.velocity.addTo(collision.normal.multiply(j * dividedMass1));
  //         obj2.velocity.addTo(collision.normal.multiply(-j * dividedMass2));
  //
  //         const wAnext = wA.add(rA.cross(n.scaled(j)).scaled(dividedMoment1));
  //         const wBnext = wB.add(rB.cross(n.scaled(j)).scaled(-dividedMoment2));
  //         obj1.angularVelocity = wAnext.z;
  //         obj2.angularVelocity = wBnext.z;
  //       }
  //     }
  //   }
  // }

  private detectCollisions = (secondsPassed: number) => {
    this.world.collidedBodies = [];
    // Start checking for collisions
    for (let i = 0; i < this.world.bodies.length; i++) {
      const obj0 = this.world.bodies[i];
      for (let j = i + 1; j < this.world.bodies.length; j++) {
        const obj1 = this.world.bodies[j];
        if (obj0.mass === 0 && obj1.mass === 0) {
          continue;
        }

        // Compare object1 with object2
        const collision = Collider.detectCollision(
          { pos: obj0.position, shape: obj0.shape },
          { pos: obj1.position, shape: obj1.shape }
        );
        if (collision){
          this.world.collidedBodies.push({
            obj0,
            obj1,
            collision
          });
        }
      }
    }
  }

  private resolvePenetrations() {
    this.world.collidedBodies.forEach(item => {
      const {
        obj0, obj1, collision
      } = item;
      // Penetration resolution
      let penResolution = collision.normal.mult(collision.penetrationDepth / (obj0.getInvertedMass() + obj1.getInvertedMass()));
      obj0.position = obj0.position.add(penResolution.mult(obj0.getInvertedMass()));
      obj1.position = obj1.position.add(penResolution.mult(-obj1.getInvertedMass()));
    })
  }

  private resolveCollisions() {
    this.world.collidedBodies.forEach(item => {
      const {
        obj0, obj1, collision
      } = item;
      // Collision resolution
      //1. Closing velocity
      let collArm1 = collision.vertex.subtr(obj0.position);
      let rotVel1 = new Vector(-obj0.angularVelocity * collArm1.y, obj0.angularVelocity * collArm1.x);
      let closVel1 = obj0.velocity.add(rotVel1);
      let collArm2 = collision.vertex.subtr(obj1.position);
      let rotVel2= new Vector(-obj1.angularVelocity * collArm2.y, obj1.angularVelocity * collArm2.x);
      let closVel2 = obj1.velocity.add(rotVel2);

      //2. Impulse augmentation
      let impAug1 = Vector.cross(collArm1, collision.normal);
      impAug1 = impAug1 * obj0.getInvertedInertia() * impAug1;
      let impAug2 = Vector.cross(collArm2, collision.normal);
      impAug2 = impAug2 * obj1.getInvertedInertia() * impAug2;

      let relVel = closVel1.subtr(closVel2);
      let sepVel = Vector.dot(relVel, collision.normal);
      let new_sepVel = -sepVel * Math.min(obj0.elasticity, obj1.elasticity);
      let vsep_diff = new_sepVel - sepVel;

      let impulse = vsep_diff / (obj0.getInvertedMass() + obj1.getInvertedMass() + impAug1 + impAug2);
      let impulseVec = collision.normal.mult(impulse);

      //3. Changing the velocities
      obj0.velocity = obj0.velocity.add(impulseVec.mult(obj0.getInvertedMass()));
      obj1.velocity = obj1.velocity.add(impulseVec.mult(-obj1.getInvertedMass()));

      obj0.angularVelocity += obj0.getInvertedInertia() * Vector.cross(collArm1, impulseVec);
      obj1.angularVelocity -= obj1.getInvertedInertia() * Vector.cross(collArm2, impulseVec);
    })
  }

  static step(physics: Physics, timestamp: number) {
    if (timestamp > 0) {
      physics.update((timestamp - physics.lastTimestamp) / 1000.0);
    }
    physics.lastTimestamp = timestamp;

    requestAnimationFrame(timestamp => Physics.step(physics, timestamp));
  }

  static run(physics: Physics) {
    Physics.step(physics, 0);
  }
}