import * as React from 'react';
import {useEffect, useRef} from 'react';
import styles from './Game.module.css';
import classNames from "classnames";
import {World} from "./world/World";
import {Car} from "./world/Car";
import {Renderer} from "./Renderer";
import {Controller} from "./Controller";
import {Physics2d} from "./physics2d/Physics2d";
import {RigidObject} from "./physics2d/RigidObject";
import {RectShape} from "./physics2d/shape/RectShape";
import {Vector} from "./utils/Vector";

type Props = {
  className?: string;
}

const world = new World();
const car = new Car();
const physics2d = new Physics2d();

// physics2d.addDynamicObject(car);

// world.roads.forEach(r => {
//   for (let i = 0; i < r.fence0.length - 1; i++) {
//     const p0 = r.fence0[i];
//     const p1 = r.fence0[i+1];
//     const p = p1.subtract(p0);
//
//     physics2d.addDynamicObject(new RigidObject(
//       new RectShape(p.getMagnitude(), 0.5),
//       0,
//       new Vector((p0.x + p1.x) / 2, (p0.y + p1.y) / 2),
//       new Vector(0, 0),
//       p.getDirection(),
//       0
//     ));
//   }
//
//   for (let i = 0; i < r.fence1.length - 1; i++) {
//     const p0 = r.fence1[i];
//     const p1 = r.fence1[i+1];
//     const p = p1.subtract(p0);
//
//     physics2d.addDynamicObject(new RigidObject(
//       new RectShape(p.getMagnitude(), 0.5),
//       0,
//       new Vector((p0.x + p1.x) / 2, (p0.y + p1.y) / 2),
//       new Vector(0, 0),
//       p.getDirection(),
//       0
//     ));
//   }
// })
//
// physics2d.addDynamicObject(new RigidObject(
//   new RectShape(100, 0.5),
//   0,
//   new Vector(50, -10),
//   new Vector(0, 0),
//   // new Vector(0, 5),
//   0,
//   0
// ));
// physics2d.addDynamicObject(new RigidObject(
//   new RectShape(100, 0.5),
//   0,
//   new Vector(50, 10),
//   new Vector(0, 0),
//   // new Vector(0, 5),
//   0,
//   0
// ));
// physics2d.addDynamicObject(new RigidObject(
//   new RectShape(),
//   10,
//   new Vector(25, 30),
//   new Vector(0, 0),
//   // new Vector(0, -5),
//   0,
//   0
// ));
//
// physics2d.addDynamicObject(new RigidObject(
//   new RectShape(),
//   100,
//   new Vector(5, 0),
//   new Vector(0, 0),
//   // new Vector(5, 5),
//   0,
//   1
// ));
//
// physics2d.addDynamicObject(new RigidObject(
//   new RectShape(),
//   10,
//   new Vector(25, 15),
//   new Vector(0, 0),
//   // new Vector(5, 5),
//   Math.PI/4,
//   0
// ));
// physics2d.addDynamicObject(new RigidObject(
//   new RectShape(),
//   100,
//   new Vector(35, 7.5),
//   new Vector(0, 0),
//   // new Vector(-5, 5),
//   Math.PI/4,
//   1
// ));
// physics2d.addDynamicObject(new RigidObject(
//   new RectShape(),
//   10,
//   new Vector(30, 30),
//   new Vector(0, 0),
//   // new Vector(5, -5),
//   Math.PI/4,
//   0
// ));

const BOX_SIZE = 20;
const BOX_WIDTH = 1;
physics2d.addDynamicObject(new RigidObject(
  new RectShape(BOX_SIZE, BOX_WIDTH),
  0,
  new Vector(0,-BOX_SIZE / 2),
  new Vector(0, 0),
  0,
  0
));
physics2d.addDynamicObject(new RigidObject(
  new RectShape(BOX_SIZE, BOX_WIDTH),
  0,
  new Vector(0, BOX_SIZE / 2),
  new Vector(0, 0),
  0,
  0
));

physics2d.addDynamicObject(new RigidObject(
  new RectShape(BOX_WIDTH, BOX_SIZE),
  0,
  new Vector(-BOX_SIZE / 2, 0),
  new Vector(0, 0),
  0,
  0
));

physics2d.addDynamicObject(new RigidObject(
  new RectShape(BOX_WIDTH, BOX_SIZE),
  0,
  new Vector(BOX_SIZE / 2, 0),
  new Vector(0, 0),
  0,
  0
));

physics2d.addDynamicObject(new RigidObject(
  new RectShape(4, 4),
  10,
  new Vector( 0, 0),
  new Vector(0, 0),
  // new Vector(5, 5),
  Math.PI / 4+ 0.001,
  0
));
//
// const SIZE = 1;
// const AMOUNT = 5;
//
// for (let j=0; j < AMOUNT; j++) {
//   for (let i = 0; i < AMOUNT; i++) {
//     physics2d.addDynamicObject(new RigidObject(
//       new RectShape(SIZE, SIZE),
//       100,
//       new Vector( - AMOUNT * SIZE / 2 + (j * (SIZE + 0.000001)), i * SIZE - AMOUNT / 2),
//       new Vector(0, 0),
//       // new Vector(5, 5),
//       0,
//       0
//     ));
//   }
// }

export const Game: React.FC<Props> = (props: Props) => {
  const {
    className,
  } = props;

  const context = useRef<CanvasRenderingContext2D>();
  const boardRef = useRef<HTMLDivElement>();
  const rendererRef = useRef<Renderer>();
  const controllerRef = useRef<Controller>();
  const lastTimestampRef = useRef<number>();

  useEffect(() => {
    if (context.current) {
      return;
    }

    const canvas = document.querySelector('#board_canvas') as HTMLCanvasElement;
    context.current = canvas.getContext("2d") as CanvasRenderingContext2D;
    rendererRef.current = new Renderer(context.current);
    rendererRef.current.loadResources();

    controllerRef.current = new Controller();
    controllerRef.current.init();

    window.requestAnimationFrame(loop);
  }, []);

  function updateSize() {
    if (boardRef?.current?.clientWidth > 0) {
      const canvas = context.current.canvas;
      canvas.width = boardRef.current?.clientWidth;
      canvas.height = boardRef.current?.clientHeight;
    }
  }

  const loop = (timestamp: number) => {
    car.applyController(controllerRef.current);

    // world.process(1/60);
    if (lastTimestampRef.current) {
      physics2d.update((timestamp - lastTimestampRef.current) / 1000);
    }
    lastTimestampRef.current = timestamp;

    rendererRef.current.setViewport(car.position);
    rendererRef.current.render(world, physics2d);

    window.requestAnimationFrame(loop);
    // setInterval(() => loop(10), 10);
  }

  useEffect(() => {
    window.addEventListener('resize', updateSize);
    updateSize();

    return () => {
      window.removeEventListener('resize', updateSize);
    }
  }, []);

  return (
    <div className={classNames(className, styles.canvas)} ref={boardRef}>
      <canvas id='board_canvas'/>
    </div>
  );
}
