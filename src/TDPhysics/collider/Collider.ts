import {Collision} from './Collision';
import {Shape} from '../shape/Shape';
import {Circle} from '../shape/Circle';
import {Vector} from '../Vector';

export interface Collidable {
  pos: Vector;
  shape: Shape;
}

export class Collider {
  //finds the projection axes for the two objects
  static findAxes(o0: Collidable, o1: Collidable){
    let axes = [];
    if(o0.shape instanceof Circle && o1.shape instanceof Circle){
      axes.push(o1.pos.subtr(o0.pos).unit());
      return axes;
    }
    // if(o0 instanceof Circle){
    //   axes.push(closestVertexToPoint(o1, o0.pos).subtr(o0.pos).unit());
    // }
    // if(o0 instanceof Line){
    //   axes.push(o0.dir.normal());
    // }
    // if (o0 instanceof Rectangle){
    //   axes.push(o0.dir.normal());
    //   axes.push(o0.dir);
    // }
    // if (o0 instanceof Triangle){
    //   axes.push(o0.vertex[1].subtr(o0.vertex[0]).normal());
    //   axes.push(o0.vertex[2].subtr(o0.vertex[1]).normal());
    //   axes.push(o0.vertex[0].subtr(o0.vertex[2]).normal());
    // }
    // if (o1 instanceof Circle){
    //   axes.push(closestVertexToPoint(o0, o1.pos).subtr(o1.pos).unit());
    // }
    // if (o1 instanceof Line){
    //   axes.push(o1.dir.normal());
    // }
    // if (o1 instanceof Rectangle){
    //   axes.push(o1.dir.normal());
    //   axes.push(o1.dir);
    // }
    // if (o1 instanceof Triangle){
    //   axes.push(o1.vertex[1].subtr(o1.vertex[0]).normal());
    //   axes.push(o1.vertex[2].subtr(o1.vertex[1]).normal());
    //   axes.push(o1.vertex[0].subtr(o1.vertex[2]).normal());
    // }
    return axes;
  }

  //returns the number of the axes that belong to an object
  static getShapeAxes(obj: Shape){
    if(obj instanceof Circle /* || obj instanceof Line */){
      return 1;
    }
    // if(obj instanceof Rectangle){
    //   return 2;
    // }
    // if(obj instanceof Triangle){
    //   return 3;
    // }
  }

//Helping functions for the SAT below
//returns the min and max projection values of a shape onto an axis
  static projShapeOntoAxis(axis, obj: Collidable){
    const vertices = obj.shape.getVertices(obj.pos, axis);
    let min = Vector.dot(axis, vertices[0]);
    let max = min;
    let collVertex = vertices[0];
    for(let i=0; i<vertices.length; i++){
      let p = Vector.dot(axis, vertices[i]);
      if(p<min){
        min = p;
        collVertex = vertices[i];
      }
      if(p>max){
        max = p;
      }
    }
    return {
      min: min,
      max: max,
      collVertex: collVertex
    }
  }

  static detectCollision(obj0: Collidable, obj1: Collidable): Collision {
    let penetrationDepth = null;
    let smallestAxis;
    let vertexObj;

    let axes = Collider.findAxes(obj0, obj1);
    let proj0, proj1;
    let firstShapeAxes = Collider.getShapeAxes(obj0.shape);

    for(let i=0; i<axes.length; i++){
      proj0 = Collider.projShapeOntoAxis(axes[i], obj0);
      proj1 = Collider.projShapeOntoAxis(axes[i], obj1);
      let overlap = Math.min(proj0.max, proj1.max) - Math.max(proj0.min, proj1.min);
      if (overlap < 0){
        return null;
      }

      if((proj0.max > proj1.max && proj0.min < proj1.min) ||
        (proj0.max < proj1.max && proj0.min > proj1.min)){
        let mins = Math.abs(proj0.min - proj1.min);
        let maxs = Math.abs(proj0.max - proj1.max);
        if (mins < maxs){
          overlap += mins;
        } else {
          overlap += maxs;
          axes[i] = axes[i].mult(-1);
        }
      }

      if (overlap < penetrationDepth || penetrationDepth === null){
        penetrationDepth = overlap;
        smallestAxis = axes[i];
        if (i<firstShapeAxes){
          vertexObj = obj1;
          if(proj0.max > proj1.max){
            smallestAxis = axes[i].mult(-1);
          }
        } else {
          vertexObj = obj0;
          if(proj0.max < proj1.max){
            smallestAxis = axes[i].mult(-1);
          }
        }
      }
    }

    let contactVertex = Collider.projShapeOntoAxis(smallestAxis, vertexObj).collVertex;
    //smallestAxis.drawVec(contactVertex.x, contactVertex.y, minOverlap, "blue");

    if(vertexObj === obj1){
      smallestAxis = smallestAxis.mult(-1);
    }

    // No penetration – no collision
    if (penetrationDepth <= 0) {
      return null;
    }

    return {
      penetrationDepth,
      normal: smallestAxis,
      vertex: contactVertex
    }
  }
}