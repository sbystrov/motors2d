export class Vector{
  x: number;
  y: number;

  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  set(x, y){
    this.x = x;
    this.y = y;
  }

  add(v: Vector): Vector{
    return new Vector(this.x+v.x, this.y+v.y);
  }

  subtr(v: Vector): Vector {
    return new Vector(this.x-v.x, this.y-v.y);
  }

  mag(): number {
    return Math.sqrt(this.x**2 + this.y**2);
  }

  mult(n: number): Vector {
    return new Vector(this.x*n, this.y*n);
  }

  normal(): Vector {
    return new Vector(-this.y, this.x).unit();
  }

  unit(): Vector {
    if(this.mag() === 0){
      return new Vector(0,0);
    } else {
      return new Vector(this.x/this.mag(), this.y/this.mag());
    }
  }
  //
  // drawVec(start_x, start_y, n, color){
  //   ctx.beginPath();
  //   ctx.moveTo(start_x, start_y);
  //   ctx.lineTo(start_x + this.x * n, start_y + this.y * n);
  //   ctx.strokeStyle = color;
  //   ctx.stroke();
  //   ctx.closePath();
  // }

  static dot(v1, v2){
    return v1.x*v2.x + v1.y*v2.y;
  }

  static cross(v1, v2){
    return v1.x*v2.y - v1.y*v2.x;
  }
}