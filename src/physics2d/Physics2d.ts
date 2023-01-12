import {RigidObject} from "./RigidObject";
import {Collision, detectCollision} from "./Collision";
import {Vector3d} from "../utils/Vector3d";
import {Vector} from "../utils/Vector";
import {Vec3} from "vec3";

export class Physics2d {
  collisions: Collision[] = [];
  dynamicObjects: RigidObject[] = [];

  public addDynamicObject(object: RigidObject) {
    this.dynamicObjects.push(object);
  }

  public update = (secondsPassed: number) => {
    this.dynamicObjects.forEach(e => {
      e.applyForces(secondsPassed);
      e.enumerateForces(secondsPassed);
    });
    this.detectCollisions(secondsPassed);
    this.dynamicObjects.forEach(e => {
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
        if (obj1.mass === 0 && obj2.mass === 0) {
          continue;
        }

        // Compare object1 with object2
        const collision = detectCollision(obj1, obj2);
        if (collision){
          this.collisions.push(collision);
          // http://www.cs.uu.nl/docs/vakken/mgp/2016-2017/Lecture%203%20-%20Collisions.pdf

          const coefficientOfRestitution = 0.3;

          const A = new Vec3(collision.obj1.position.x, collision.obj1.position.y, 0);
          const B = new Vec3(collision.obj2.position.x, collision.obj2.position.y, 0);
          const p = new Vec3(collision.position.x, collision.position.y, 0);
          const n = new Vec3(collision.normal.x, collision.normal.y, 0);
          const wA = new Vec3(0, 0, collision.obj1.angularVelocity);
          const wB = new Vec3(0, 0, collision.obj2.angularVelocity);
          const rA = p.minus(A);
          const rB = p.minus(B);
          const wArA = wA.cross(rA);
          const wBrB = wB.cross(rB);
          const dividedMass1 = collision.obj1.mass === 0 ? 0 : 1 / collision.obj1.mass;
          const dividedMass2 = collision.obj2.mass === 0 ? 0 : 1 / collision.obj2.mass;
          const dividedMoment1 = collision.obj1.mass === 0 ? 0 : 1 / collision.obj1.momentOfInertia();
          const dividedMoment2 = collision.obj2.mass === 0 ? 0 : 1 / collision.obj2.momentOfInertia();

          let vA = new Vec3(collision.obj1.velocity.x, collision.obj1.velocity.y, 0);
          vA = vA.plus(wArA);
          let vB = new Vec3(collision.obj2.velocity.x, collision.obj2.velocity.y, 0);
          vB = vB.plus(wBrB);

          let angularImpulsePartV = rA.cross(n).scaled(dividedMoment1).cross(rA);
          angularImpulsePartV = angularImpulsePartV.plus(rB.cross(n).scaled(dividedMoment2).cross(rB));
          const angularImpulsePart = angularImpulsePartV.dot(n);

          let j = -(1 + coefficientOfRestitution) * vA.minus(vB).dot(n);
          j = j / ((dividedMass1 + dividedMass2) + angularImpulsePart);

          if (j < 0) {
            // Objects are going apart - ignore interaction
            continue;
          }

          obj1.velocity.addTo(collision.normal.multiply(j * dividedMass1));
          obj2.velocity.addTo(collision.normal.multiply(-j * dividedMass2));

          const wAnext = wA.add(rA.cross(n.scaled(j)).scaled(dividedMoment1));
          const wBnext = wB.add(rB.cross(n.scaled(j)).scaled(-dividedMoment2));
          obj1.angularVelocity = wAnext.z;
          obj2.angularVelocity = wBnext.z;
        }
      }
    }
  }
}