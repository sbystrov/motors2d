import {RigidObject} from "./RigidObject";
import {Road} from "./roads/Road";
import {RoadBuilder} from "./roads/RoadBuilder";
import {Vector} from "../utils/Vector";

export class World {
  public entities: RigidObject[] = [];
  public roads: Road[] = [];
  public ground: string[] = [];
  public size = 10;

  constructor() {
    this.generateGround();
  }

  public generateGround() {
    const types = ['dirt'];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.ground[x + y * this.size] = types[Math.floor(Math.random() * types.length)];
      }
    }

    // Roads
    const roadGenerator = new RoadBuilder(new Vector(0, 0));
    roadGenerator.randomSector(1000);

    this.roads.push(roadGenerator.road);
  }
  process = () => {
    this.entities.forEach(e => {
      e.setState(e.nextState(this, 1 / 60));
    })
  }
}