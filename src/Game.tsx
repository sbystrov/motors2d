import * as React from 'react';
import {useEffect, useRef} from 'react';
import styles from './Game.module.css';
import classNames from "classnames";

type Props = {
  className?: string;
}

const square = {
  height: 32,
  jumping: true,
  width: 32,
  x: 0,
  y: 0,
  direction: 0,
  velocity: 0
};

const controller = {
  left: false,
  right: false,
  up: false,
  down: false,
  keyListener: function (event: KeyboardEvent) {

    var key_state = (event.type == "keydown") ? true : false;

    switch (event.keyCode) {

      case 37:// left key
        controller.left = key_state;
        break;
      case 38:// up key
        controller.up = key_state;
        break;
      case 40:// down key
        controller.down = key_state;
        break;
      case 39:// right key
        controller.right = key_state;
        break;

    }

  }

};

export const Game: React.FC<Props> = (props: Props) => {
  const {
    className,
  } = props;

  const context = useRef<CanvasRenderingContext2D>();
  const boardRef = useRef<HTMLDivElement>();
  const imgRef = useRef<HTMLImageElement>();
  const imgCarRef = useRef<HTMLImageElement>();

  useEffect(() => {
    if (context.current) {
      return;
    }

    const canvas = document.querySelector('#board_canvas') as HTMLCanvasElement;
    context.current = canvas.getContext("2d") as CanvasRenderingContext2D;

    const img = new Image();      // First create the image...
    img.onload = function(){  // ...then set the onload handler...
      imgRef.current = img;
    };
    img.src = "/ground.png";

    const imgCar = new Image();      // First create the image...
    imgCar.onload = function(){  // ...then set the onload handler...
      imgCarRef.current = imgCar;
    };
    imgCar.src = "/car.png";

    // canvas.current = new fabric.Canvas('board_canvas', {
    //   height: '1024',
    //   width: '900',
    // });
    //
    // canvas.current.backgroundColor = "#eeeeee";
    // canvas.current.selection = false;
    // canvas.current.renderTop();
    //
    // return () => {
    //   if (canvas.current) {
    //     canvas.current.dispose();
    //     canvas.current = null;
    //   }
    // }

    window.addEventListener("keydown", controller.keyListener)
    window.addEventListener("keyup", controller.keyListener);

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

    if (controller.up) {
      square.velocity += 0.2;
    }
    if (controller.down) {
      square.velocity -= 0.2;
    }

    if (controller.left) {
      square.direction -= 0.05;
    }

    if (controller.right) {
      square.direction += 0.05;
    }

    // square.yVelocity += 1.5;// gravity
    square.x += square.velocity * Math.cos(square.direction);
    square.y += square.velocity * Math.sin(square.direction);
    square.velocity *= 0.9;// friction

    context.current.fillStyle = "#201A23";
    context.current.fillRect(0, 0, context.current.canvas.width, context.current.canvas.height); // x, y, width, height

    context.current.save();

    context.current.translate(context.current.canvas.width/2, context.current.canvas.height/ 2);
    context.current.translate(-square.x, -square.y);


    if (imgRef.current) {
      const tile_width = 128;
      const tile_height = 128;
      for (let x = 0; x < context.current.canvas.width + tile_width; x += tile_width) {
        for (let y = 0; y < context.current.canvas.height + tile_height; y += tile_height) {
          context.current.drawImage(imgRef.current, x, y, tile_width, tile_height);
        }
      }
    }


    // Creates and fills the cube for each frame
    context.current.save();
    context.current.translate(square.x, square.y);
    context.current.rotate(square.direction + Math.PI / 2); // in the screenshot I used angle = 20

    if (imgCarRef.current) {
      context.current.drawImage(imgCarRef.current, -square.width / 2, -square.height / 2, square.width, square.height);
    }

    context.current.restore();

    context.current.restore();

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
      <canvas id='board_canvas' />
    </div>
  );
}
