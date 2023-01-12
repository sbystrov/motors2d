import * as React from 'react';
import {useEffect, useRef} from 'react';
import styles from './Game.module.css';
import classNames from "classnames";
import {Renderer} from './TDPhysics/Renderer';
import {Physics} from './TDPhysics/Physics';
import {Bodies} from './TDPhysics/Bodies';
import {Vector} from './TDPhysics/Vector';

type Props = {
  className?: string;
}

export const Game2: React.FC<Props> = (props: Props) => {
  const {
    className,
  } = props;

  const boardRef = useRef<HTMLDivElement>();
  const rendererRef = useRef<Renderer>();
  const physicsRef = useRef<Physics>();

  useEffect(() => {
    physicsRef.current = new Physics();
    // const r1 = Bodies.rectangle(0, 0, 100, 100);
    // r1.velocity = vec2.fromValues(0, 100);
    // const wall = Bodies.rectangle(0, 200, 1000, 10);
    // physicsRef.current.world.add([r1, wall]);

    // // Test becnh 2
    // const c1 = Bodies.circle(20, 0, 100);
    // c1.velocity = new Vector(0, 100);
    // const c2 = Bodies.circle(0, 200, 10);
    // c2.setMass(5);
    // const c3 = Bodies.circle(40, 200, 10);
    // c3.setMass(10);
    // physicsRef.current.world.add([c1, c2, c3]);

    // Test becnh 3 (billiard)
    const c1 = Bodies.circle(0, 0, 10);
    c1.velocity = new Vector(0, 400);
    physicsRef.current.world.add([c1]);

    const R = 10;
    for (let i=0; i<5; i++) {
      for (let j=0; j<=i; j++) {
        const c = Bodies.circle(j * R * 2 - i * Math.cos(Math.PI / 6) * R, 300 + 2 * i * Math.cos(Math.PI / 6) * R, R - 0.5);
        physicsRef.current.world.add([c]);

      }
    }

    const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
    rendererRef.current = new Renderer(canvas, physicsRef.current);

    window.addEventListener('resize', updateSize);
    updateSize();

    Physics.run(physicsRef.current);
    Renderer.run(rendererRef.current);

    return () => {
      window.removeEventListener('resize', updateSize);
    }
  }, []);

  function updateSize() {
    if (boardRef?.current?.clientWidth > 0 && rendererRef.current.canvas) {
      const canvas = rendererRef.current.canvas;
      canvas.width = boardRef.current?.clientWidth;
      canvas.height = boardRef.current?.clientHeight;
    }
  }

  return (
    <div className={classNames(className, styles.canvas)} ref={boardRef}>
      <canvas id='canvas'/>
    </div>
  );
}
