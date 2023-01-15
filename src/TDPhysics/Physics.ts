import {World} from './World';
import {Collider} from './collider/Collider';
import {Vector} from './Vector';
import {RigidBody} from './RigidBody';

// Based on these tutorials:
// 1. http://www.cs.uu.nl/docs/vakken/mgp/2016-2017/Lecture%203%20-%20Collisions.pdf
// 2. https://github.com/danielszabo88/mocorgo
// 3. https://www.youtube.com/watch?v=TUZvvmu4Yz4
// 4. https://habr.com/ru/post/341540/ (friction)
// 5. https://gamedevelopment.tutsplus.com/series/how-to-create-a-custom-physics-engine--gamedev-12715

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

      const percent = 0.4 // usually 20% to 80%
      const kSlop = 0.05 // usually 0.01 to 0.1

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
      // Calculate radii from COM to contact
      const ra = collision.vertex.subtr(obj0.position);
      const rb = collision.vertex.subtr(obj1.position);

      // Relative velocity
      const rv = obj1.velocity
        .add(new Vector(-obj1.angularVelocity * rb.y, obj1.angularVelocity * rb.x))
        .subtr(obj0.velocity)
        .subtr(new Vector(-obj0.angularVelocity * ra.y, obj0.angularVelocity * ra.x));

      // Relative velocity along the normal
      const contactVel = Vector.dot(rv, collision.normal);

      // Do not resolve if velocities are separating
      if(contactVel < 0)
        return;

      const raCrossN = Vector.cross( ra, collision.normal );
      const rbCrossN = Vector.cross( rb, collision.normal );
      const invMassSum = obj0.getInvertedMass() + obj1.getInvertedMass() + raCrossN**2 * obj0.getInvertedInertia() + rbCrossN**2 * obj1.getInvertedInertia();

      // Calculate impulse scalar
      let j = -(1.0 + Math.min( obj0.elasticity, obj1.elasticity )) * contactVel;
      j /= invMassSum;
      // j /= contact_count;

      // Apply impulse
      const impulse = collision.normal.mult(j);

      obj0.velocity = obj0.velocity.add(impulse.mult(-obj0.getInvertedMass()));
      obj1.velocity = obj1.velocity.add(impulse.mult(obj1.getInvertedMass()));

      obj0.angularVelocity -= obj0.getInvertedInertia() * Vector.cross(ra, impulse);
      obj1.angularVelocity += obj1.getInvertedInertia() * Vector.cross(rb, impulse);

      // Friction impulse
      const t = rv.subtr(collision.normal.mult(Vector.dot( rv, collision.normal ))).unit();

      // j tangent magnitude
      let jt = -Vector.dot( rv, t );
      jt /= invMassSum;
      // jt /= (real)contact_count;

      // Don't apply tiny friction impulses
      if(jt === 0) {
        return;
      }

      const sf = Math.sqrt( obj0.staticFriction * obj1.staticFriction );
      const df = Math.sqrt( obj0.dynamicFriction * obj1.dynamicFriction );
      // Coulumb's law
      let tangentImpulse;
      if(Math.abs( jt ) < j * sf)
        tangentImpulse = t.mult(jt);
      else
        tangentImpulse = t.mult(jt * df);

      // debugger;

      // Apply friction impulse
      obj0.velocity = obj0.velocity.add(tangentImpulse.mult(-obj0.getInvertedMass()));
      obj1.velocity = obj1.velocity.add(tangentImpulse.mult(obj1.getInvertedMass()));

      obj0.angularVelocity -= obj0.getInvertedInertia() * Vector.cross(ra, tangentImpulse);
      obj1.angularVelocity += obj1.getInvertedInertia() * Vector.cross(rb, tangentImpulse);
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
      const dt = Math.min((timestamp - physics.lastTimestamp) / 1000.0, 0.01);
      physics.update(dt);
    }
    physics.lastTimestamp = timestamp;

    requestAnimationFrame(timestamp => Physics.step(physics, timestamp));
  }

  static run(physics: Physics) {
    Physics.step(physics, 0);
  }
}