import * as React from 'react';
import {useEffect, useRef} from 'react';
import styles from './Game.module.css';
import classNames from "classnames";
import {Renderer} from './TDPhysics/Renderer';
import {Physics} from './TDPhysics/Physics';
import {Bodies} from './TDPhysics/Bodies';

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

    // // Test bench 2
    // const c1 = Bodies.circle(20, 0, 100);
    // c1.velocity = new Vector(0, 100);
    // const c2 = Bodies.circle(0, 200, 10);
    // c2.setMass(5);
    // const c3 = Bodies.circle(40, 200, 10);
    // c3.setMass(10);
    // physicsRef.current.world.add([c1, c2, c3]);

    // // Test bench 3 (billiard)
    // const c1 = Bodies.circle(0, 0, 10);
    // c1.velocity = new Vector(0, 400);
    // physicsRef.current.world.add([c1]);
    // const R = 10;
    // for (let i=0; i<6; i++) {
    //   for (let j=0; j<=i; j++) {
    //     const c = Bodies.circle(j * R * 2 - i * Math.cos(Math.PI / 6) * R, 200 + 2 * i * Math.cos(Math.PI / 6) * R, R - 0.5);
    //     physicsRef.current.world.add([c]);
    //   }
    // }

    // // Test bench 4 (circle + rect)
    // const c1 = Bodies.circle(80, -80, 100);
    // c1.velocity = new Vector(0, 100);
    // const wall = Bodies.rectangle(0, 300, 1000, 50);
    // physicsRef.current.world.add([c1, wall]);

    // // Test bench 5 (rect + static wall)
    // const c1 = Bodies.rectangle(80, -80, 100, 100);
    // const c2 = Bodies.rectangle(0, 0, 1250, 30);
    // // c2.orientation = Math.PI / 30;
    // c2.angularVelocity = 1;
    // c2.setMass(0);
    // const wall0 = Bodies.rectangle(0, 500, 1000, 50);
    // wall0.setMass(0);
    // const wall1 = Bodies.rectangle(0, -500, 1000, 50);
    // wall1.setMass(0);
    // const wall2 = Bodies.rectangle(500, 0, 50, 1000);
    // wall2.setMass(0);
    // const wall3 = Bodies.rectangle(-500, 0, 50, 1000);
    // wall3.setMass(0);
    // physicsRef.current.world.add([c1, c2, wall0, wall1, wall2, wall3]);
    //
    // const R = 10;
    // for (let i=0; i<10; i++) {
    //   for (let j=0; j<=i; j++) {
    //     const c = Bodies.circle(j * R * 2 - i * Math.cos(Math.PI / 6) * R, 200 + 2 * i * Math.cos(Math.PI / 6) * R, R - 0.5);
    //     physicsRef.current.world.add([c]);
    //   }
    // }

    // // Test bench 6 (many rects)
    // const wall0 = Bodies.rectangle(0, 500, 1000, 50);
    // wall0.setMass(0);
    // const wall1 = Bodies.rectangle(0, -500, 1000, 50);
    // wall1.setMass(0);
    // const wall2 = Bodies.rectangle(500, 0, 50, 1000);
    // wall2.setMass(0);
    // const wall3 = Bodies.rectangle(-500, 0, 50, 1000);
    // wall3.setMass(0);
    // physicsRef.current.world.add([wall0, wall1, wall2, wall3]);
    //
    // // const c1 = Bodies.rectangle(80, -80, 100, 100);
    // // physicsRef.current.world.add([c1]);
    //
    // const R = 30;
    // const N = 5;
    // for (let i=0; i < N; i++) {
    //   for (let j=0; j < N; j++) {
    //     const c = Bodies.rectangle(i * R - N * R / 2, 500 - 25 - (j + 0.5) * R, R, R);
    //     physicsRef.current.world.add([c]);
    //   }
    // }
    //
    // // Test bench 7 (slope)
    // const wall0 = Bodies.rectangle(0, 500, 1000, 50);
    // wall0.setMass(0);
    // const wall1 = Bodies.rectangle(0, -500, 1000, 50);
    // wall1.setMass(0);
    // const wall2 = Bodies.rectangle(500, 0, 50, 1000);
    // wall2.setMass(0);
    // const wall3 = Bodies.rectangle(-500, 0, 50, 1000);
    // wall3.setMass(0);
    // physicsRef.current.world.add([wall0, wall1, wall2, wall3]);
    //
    // const c1 = Bodies.rectangle(80, -60, 100, 100);
    // // c1.velocity = new Vector(100, 0);
    // const c2 = Bodies.rectangle(0, 0, 800, 10);
    // c2.orientation = Math.PI / 6;
    // c2.setMass(0);
    // physicsRef.current.world.add([c1, c2]);


    // Test bench 8 (many rects + slope)
    const wall0 = Bodies.rectangle(0, 500, 1000, 50);
    wall0.setMass(0);
    const wall1 = Bodies.rectangle(0, -500, 1000, 50);
    wall1.setMass(0);
    const wall2 = Bodies.rectangle(500, 0, 50, 1000);
    wall2.setMass(0);
    const wall3 = Bodies.rectangle(-500, 0, 50, 1000);
    wall3.setMass(0);
    physicsRef.current.world.add([wall0, wall1, wall2, wall3]);

    const c1 = Bodies.rectangle(0, 0, 900, 10);
    c1.setMass(0);
    c1.orientation = Math.PI / 6;
    physicsRef.current.world.add([c1]);

    const R = 30;
    const N = 5;
    for (let i=0; i < N; i++) {
      for (let j=0; j < N; j++) {
        const c = Bodies.rectangle(i * R - N * R / 2, -200 - 25 - (j + 0.5) * R, R, R);
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
