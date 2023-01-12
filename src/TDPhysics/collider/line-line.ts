import {vec2} from 'gl-matrix';

export const lineLine = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): vec2 => {
  // calculate the direction of the lines
  const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

    // optionally, draw a circle where the lines meet
    const intersectionX = x1 + (uA * (x2-x1));
    const intersectionY = y1 + (uA * (y2-y1));
    // fill(255,0,0);
    // noStroke();
    // ellipse(intersectionX, intersectionY, 20, 20);

    return vec2.fromValues(intersectionX, intersectionY);
  }
  return null;
}