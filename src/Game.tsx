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
// const car = new Car();
const physics2d = new Physics2d();

// world.entities.push(car);
physics2d.addDynamicObject(new RigidObject(
  new RectShape(),
  1000,
  new Vector(25, 5),
  new Vector(0, 5),
  0
));
physics2d.addDynamicObject(new RigidObject(
  new RectShape(),
  10,
  new Vector(25, 30),
  new Vector(0, -5),
  0
));
physics2d.addDynamicObject(new RigidObject(
  new RectShape(),
  10,
  new Vector(15, 0),
  new Vector(5, 5),
  0
));

physics2d.addDynamicObject(new RigidObject(
  new RectShape(),
  10,
  new Vector(25, 15),
  new Vector(5, 5),
  0
));
physics2d.addDynamicObject(new RigidObject(
  new RectShape(),
  10,
  new Vector(35, 7.5),
  new Vector(-5, 5),
  0
));
physics2d.addDynamicObject(new RigidObject(
  new RectShape(),
  10,
  new Vector(30, 30),
  new Vector(5, -5),
  0
));

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
    // car.applyController(controllerRef.current);

    // world.process(1/60);
    if (lastTimestampRef.current) {
      physics2d.update((timestamp - lastTimestampRef.current) / 1000);
    }
    lastTimestampRef.current = timestamp;

    // rendererRef.current.setViewport(car.state.position);
    rendererRef.current.render(world, physics2d);

    window.requestAnimationFrame(loop);
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
