import {Entity} from "./Entity";

export class World {
  public entities: Entity[] = [];

  process = () => {
    this.entities.forEach(e => {
      e.setState(e.nextState());
    })
  }
}