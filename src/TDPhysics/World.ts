import {RigidBody} from './RigidBody';
import {Collision} from './collider/Collision';

export interface CollidedBodies {
  obj0: RigidBody;
  obj1: RigidBody;
  collision: Collision;
}

export class World {
  bodies: RigidBody[] = [];
  collidedBodies:CollidedBodies[] = [];

  add(bodiesToAdd: RigidBody[]) {
    this.bodies.push(...bodiesToAdd);
  }
}