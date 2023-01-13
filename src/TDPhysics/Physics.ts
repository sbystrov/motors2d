import {World} from './World';
import {Collider} from './collider/Collider';
import {Vector} from './Vector';
import {RigidBody} from './RigidBody';

// Based on these tutorials:
// 1. http://www.cs.uu.nl/docs/vakken/mgp/2016-2017/Lecture%203%20-%20Collisions.pdf
// 2. https://github.com/danielszabo88/mocorgo
// 3. https://www.youtube.com/watch?v=TUZvvmu4Yz4
// 4. https://habr.com/ru/post/341540/ (friction)

export class Physics {
  world: World = new World();
  lastTimestamp: number = 0;
  // collisions: Collision[] = [];

  public update = (secondsPassed: number) => {
    this.world.bodies.forEach(e => {
      this.applyForces(e, secondsPassed);
      // e.enumerateForces(secondsPassed);

      e.appliedForces = [];
      e.addForce({
        point: new Vector(0, 0),
        force: new Vector(0, 10 * 9.8 * e.mass).rotate(-e.orientation)
      })
    });
    this.detectCollisions();
    this.resolvePenetrations();
    this.resolveCollisions();

    this.updatePositionAndOrientation(secondsPassed);
  }

  private updatePositionAndOrientation(secondsPassed: number) {
    this.world.bodies.forEach(body => {
      body.position = body.position.add(body.velocity.mult(secondsPassed));
      body.orientation = body.orientation + body.angularVelocity * secondsPassed;
    });
  }

  private detectCollisions = () => {
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
          {
            position: obj0.position,
            shape: obj0.shape,
            directionVector: new Vector(Math.cos(obj0.orientation), Math.sin(obj0.orientation))
          },
          {
            position: obj1.position,
            shape: obj1.shape,
            directionVector: new Vector(Math.cos(obj1.orientation), Math.sin(obj1.orientation))
          }
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

      const percent = 0.8 // usually 20% to 80%
      const kSlop = 0.01 // usually 0.01 to 0.1

      let penResolution = collision.normal.mult(percent * Math.max(collision.penetrationDepth - kSlop, 0 ) / (obj0.getInvertedMass() + obj1.getInvertedMass()));
      obj0.position = obj0.position.add(penResolution.mult(obj0.getInvertedMass()));
      obj1.position = obj1.position.add(penResolution.mult(-obj1.getInvertedMass()));
    })
  }

  static pythagoreanSolve(a: number, b: number): number {
    return Math.sqrt(a**2 + b**2);
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
      // Objects are going apart - ignore interaction
      if (impulse < 0) {
        impulse = 0;
      }

      let impulseVec = collision.normal.mult(impulse);
      //3. Friction
      const tangent = relVel.subtr(collision.normal.mult(Vector.dot( relVel, collision.normal ))).unit();

      // Вычисляем величину, прилагаемую вдоль вектора трения
      const jt = -Vector.dot(relVel, tangent) / (obj0.getInvertedMass() + obj1.getInvertedMass());

      // PythagoreanSolve = A^2 + B^2 = C^2, вычисляем C для заданных A и B
      // Используем для аппроксимации мю для заданных коэффициентов трения каждого тела
      const mu = Physics.pythagoreanSolve( obj0.staticFriction, obj1.staticFriction );

      // Ограничиваем величину трения и создаём вектор импульса силы
      if(Math.abs( jt ) < impulse * mu) {
        impulseVec = impulseVec.add(tangent.mult(jt));
      } else {
        const dynamicFriction = Physics.pythagoreanSolve( obj0.dynamicFriction, obj1.dynamicFriction );
        impulseVec = impulseVec.add(tangent.mult(-impulse * dynamicFriction));
      }

      //4. Changing the velocities
      obj0.velocity = obj0.velocity.add(impulseVec.mult(obj0.getInvertedMass()));
      obj1.velocity = obj1.velocity.add(impulseVec.mult(-obj1.getInvertedMass()));

      obj0.angularVelocity += obj0.getInvertedInertia() * Vector.cross(collArm1, impulseVec);
      obj1.angularVelocity -= obj1.getInvertedInertia() * Vector.cross(collArm2, impulseVec);
    })
  }

  private applyForces(obj: RigidBody, secondsPassed: number) {
    let force = new Vector(0,0);
    let momentum = 0;

    for (let i = 0; i < obj.appliedForces.length; i++) {
      const appliedForce = obj.appliedForces[i];

      force = force.add(appliedForce.force);

      const perpendicular = new Vector(-appliedForce.point.y, appliedForce.point.x).unit();
      const momentumForce = new Vector(perpendicular.x, perpendicular.y);
      momentumForce.mult(Vector.dot(perpendicular, appliedForce.force));

      // const momentumForce = perpendicular.multiply(perpendicular.dotProduct(appliedForce.force) / appliedForce.force.dotProduct(appliedForce.force));
      momentumForce.rotateBy(-appliedForce.point.getDirection());
      if (appliedForce.point.mag() > 0) {
        momentum += Math.sign(momentumForce.y) * momentumForce.mag() / (obj.mass * (appliedForce.point.mag() ^ 2));
      }
    }

    // Now change speed and angular velocity
    if (obj.mass) {
      obj.velocity = obj.velocity.add(force.rotate(obj.orientation).mult(secondsPassed / obj.mass));
      obj.angularVelocity += momentum * secondsPassed;
    }
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