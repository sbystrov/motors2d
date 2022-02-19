import {Entity} from "./Entity";

export class World {
  public entities: Entity[] = [];
  public ground: string[] = [];
  public size = 10;

  constructor() {
    this.generateGround();
  }

  public generateGround() {
    const types = ['tarmac', 'dirt'];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.ground[x + y * this.size] = types[Math.floor(Math.random() * 2)];
      }
    }
  }
  process = () => {
    this.entities.forEach(e => {
      e.setState(e.nextState(this));
    })
  }
}