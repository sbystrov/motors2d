import * as React from 'react';
import {useEffect, useRef} from 'react';
import styles from './Game.module.css';
import classNames from "classnames";
import {World} from "./world/World";
import {Car} from "./world/Car";
import {Renderer} from "./Renderer";
import {Controller} from "./Controller";

type Props = {
  className?: string;
}

const world = new World();
const car = new Car();

world.entities.push(car);

export const Game: React.FC<Props> = (props: Props) => {
  const {
    className,
  } = props;

  const context = useRef<CanvasRenderingContext2D>();
  const boardRef = useRef<HTMLDivElement>();
  const rendererRef = useRef<Renderer>();
  const controllerRef = useRef<Controller>();


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

  const loop = () => {
    car.applyController(controllerRef.current);

    world.process();

    rendererRef.current.setViewport({x: car.state.x, y: car.state.y});
    rendererRef.current.render(world);

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
