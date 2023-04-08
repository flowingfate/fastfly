import React, { Component, CSSProperties, memo, useEffect, useState } from 'react';

const TARGET_SIZE = 25;

/**
 * ------------------------------------------------------------------------------------------
 * The Dot Component
 * ------------------------------------------------------------------------------------------
 */
interface DotProps {
  x: number;
  y: number;
  size: number;
  text: string | number;
}
function Dot({ x, y, size, text }: DotProps) {
  const [hover, set] = useState(false);
  const s = size * 1.3;
  const style: CSSProperties = {
    position: 'absolute',
    textAlign: 'center',
    cursor: 'pointer',
    width: s,
    height: s,
    left: x,
    top: y,
    borderRadius: s / 2,
    lineHeight: s + 'px',
    background: hover ? '#ff0' : '#61dafb',
  };
  return (
    <div style={style} onMouseEnter={() => set(true)} onMouseLeave={() => set(false)}>
      {hover ? '*' + text + '*' : text}
    </div>
  );
}

/**
 * ------------------------------------------------------------------------------------------
 * The Triangle Component
 * ------------------------------------------------------------------------------------------
 */
interface TriangleProps {
  x: number;
  y: number;
  s: number;
  text: string | number;
}
const Triangle = memo<TriangleProps>(({ x, y, s, text }) => {
  if (s <= TARGET_SIZE) {
    const half = TARGET_SIZE / 2;
    return (
      <Dot x={x - half} y={y - half} size={TARGET_SIZE} text={text} />
    );
  }

  s /= 2;
  const half = s / 2;
  return (
    <>
      <Triangle x={x} y={y - half} s={s} text={text} />
      <Triangle x={x - s} y={y + half} s={s} text={text} />
      <Triangle x={x + s} y={y + half} s={s} text={text} />
    </>
  );
}, (o, n) => false && (
  o.x === n.x &&
  o.y === n.y &&
  o.s === n.s &&
  o.text === n.text
));

/**
 * ------------------------------------------------------------------------------------------
 * The Tree Component
 * ------------------------------------------------------------------------------------------
 */
interface TreeProps {
  elapsed: number;
}
function Tree({ elapsed }: TreeProps) {
  const [seconds, set] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      set(prev => ((prev % 10) + 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const t = (elapsed / 1000) % 10;
  const scale = 1 + (t > 5 ? 10 - t : t) / 10;
  const style: CSSProperties = {
    position: 'absolute',
    transform: 'scaleX(' + (scale / 2.1) + ') scaleY(0.7) translateZ(0.1px)',
    left: '50%',
    top: '50%',
  };
  return (
    <div style={style}>
      <Triangle x={0} y={0} s={1000} text={seconds} />
    </div>
  );
}

/**
 * ------------------------------------------------------------------------------------------
 * The Animation Component
 * ------------------------------------------------------------------------------------------
 */
export class Animation extends Component {
  private start = Date.now();
  private unmounted = false;

  componentDidMount() {
    const update = () => {
      if (this.unmounted) return;
      this.forceUpdate();
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const time = Date.now() - this.start;
    return <Tree elapsed={time} />;
  }
}

