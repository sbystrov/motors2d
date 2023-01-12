import {Vector} from '../Vector';

export interface Collision {
  penetrationDepth: number;
  normal: Vector;
  vertex: Vector;
}