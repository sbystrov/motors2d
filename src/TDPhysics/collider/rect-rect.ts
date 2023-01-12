import {vec2} from 'gl-matrix';
import {Collision} from './Collision';
import {lineLine} from './line-line';
import {RigidBody} from '../RigidBody';

export const rectRect = (obj0: RigidBody, obj1: RigidBody): Collision => {
  // const poly0 = obj0.shape.getPoly(obj0.position, obj0.orientation);
  // const poly1 = obj1.shape.getPoly(obj1.position, obj1.orientation);
  //
  // const collisionPoints: vec2[] = [];
  // for (let i = 0; i < poly0.lines.length; i++) {
  //   const l0 = poly0.lines[i];
  //
  //   for (let j = 0; j < poly1.lines.length; j++) {
  //     const l1 = poly1.lines[j];
  //     const collision = lineLine(l0.x0, l0.y0, l0.x1, l0.y1, l1.x0, l1.y0, l1.x1, l1.y1);
  //     if (collision) {
  //       collisionPoints.push(collision);
  //     }
  //   }
  // }
  //
  // if (collisionPoints.length === 2) {
  //   let resX = 0;
  //   let resY = 0;
  //
  //   collisionPoints.forEach(p => {
  //     resX += p.x;
  //     resY += p.y;
  //   });
  //
  //   const position = vec2.fromValues(resX / collisionPoints.length, resY / collisionPoints.length);
  //   const rA = obj0.position.subtract(position);
  //
  //   const normal = collisionPoints[0].subtract(collisionPoints[1]);
  //   normal.rotateBy(Math.PI / 2);
  //   normal.multiplyBy(Math.sign(rA.dotProduct(normal)));
  //   normal.normalize();
  //
  //   const collision: Collision = {
  //     obj0,
  //     obj1,
  //     position,
  //     normal
  //   }
  //
  //   return collision;
  // }

  return null;
}