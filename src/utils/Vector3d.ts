export class Vector3d {
  public x: number;
  public y: number;
  public z: number;

  constructor(x, y, z) {
    if (isNaN(x) || isNaN(y) || isNaN(z)) throw new TypeError(`invalid vector [${x},${y},${z}]`);
    this.x = Number(x);
    this.y = Number(y);
    this.z = Number(z);
  }

  cross(v) {
    if (!(v instanceof Vector3d)) throw new TypeError('v is not Vector3d object');
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    return new Vector3d(x, y, z);
  }

  times(x) {
    if (isNaN(x)) throw new TypeError(`invalid scalar value ‘${x}’`);
    return new Vector3d(this.x * x, this.y * x, this.z * x);
  }
}