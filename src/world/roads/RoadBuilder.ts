import {Vector} from "../../utils/Vector";
import {Road} from "./Road";
import {Triangle} from "../../utils/Triangle";

export class RoadBuilder {
  position: Vector;
  pLeft: Vector;
  pRight: Vector;
  direction: Vector;
  width: number;
  length: number = 0;
  road: Road;

  constructor(start: Vector) {
    this.position = start;
    this.direction = new Vector(1, 0);
    this.width = 30;
    this.road = new Road();

    const perpendicular = this.direction.copy();
    perpendicular.setDirection(perpendicular.getDirection() - Math.PI / 2);

    this.pLeft = this.position.add(perpendicular.multiply(this.width / 2));
    this.pRight = this.position.subtract(perpendicular.multiply(this.width / 2));
  }

  moveForward(length: number) {
    const positionNext = this.position.add(this.direction.multiply(length));
    const pLeftNext = this.pLeft.add(this.direction.multiply(length));
    const pRightNext = this.pRight.add(this.direction.multiply(length));

    this.road.addTile(new Triangle(this.pLeft, this.pRight, pLeftNext));
    this.road.addTile(new Triangle(this.pRight, pLeftNext, pRightNext));

    // Move position
    this.position = positionNext;
    this.pLeft = pLeftNext;
    this.pRight = pRightNext;
    this.length += length;
  }

  turn(angle: number, maxLength: number) {
    const length = Math.max(maxLength, this.width * angle);
    const stepCount = length / 10;
    for (let step = 0; step < stepCount; step++) {
      // Add two triangles
      const directionNext = this.direction.copy();
      directionNext.setDirection(directionNext.getDirection() + angle / stepCount);

      const perpendicular = directionNext.copy();
      perpendicular.setDirection(perpendicular.getDirection() - Math.PI / 2);

      const positionNext = this.position.add(directionNext.multiply(length / stepCount));
      const pLeftNext = positionNext.add(perpendicular.multiply(this.width / 2));
      const pRightNext = positionNext.subtract(perpendicular.multiply(this.width / 2));

      this.road.addTile(new Triangle(this.pLeft, this.pRight, pLeftNext));
      this.road.addTile(new Triangle(this.pRight, pLeftNext, pRightNext));

      // Move position
      this.direction = directionNext;
      this.position = positionNext;
      this.pLeft = pLeftNext;
      this.pRight = pRightNext;

      this.length += length / stepCount;
    }
  }

  randomSector(length: number) {
    while (this.length < length) {
      this.moveForward(50 + Math.random() * 300);

      this.turn(Math.random() * Math.PI,Math.random() * 200);
    }
  }
}