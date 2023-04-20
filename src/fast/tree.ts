import { FASTElement, Observable, customElement, html } from '@microsoft/fast-element';
import { observe } from './observe';

function half(num: number) {
  return num / 2;
}
const TARGET_SIZE = 25;
const HALF_TARGET_SIZE = half(TARGET_SIZE);

/**
 * ------------------------------------------------------------------------------------------
 * The Dot Component
 * ------------------------------------------------------------------------------------------
 */
@customElement({
  name: 'f-dot',
  template: html`
    <div style=${x => x.boxStyle()}
      @mouseenter=${x => { x.hover = true }}
      @mouseleave=${x => { x.hover = false }}>
      ${x => x.hover ? `*${x.text}*` : x.text}
    </div>
  `,
})
export class Dot extends FASTElement {
  public hover = false;
  public x = 0;
  public y = 0;
  public size = 1;
  public text = '';

  constructor() {
    super();
    observe(this, 'hover', 'x', 'y', 'size', 'text');
  }

  public boxStyle() {
    const { hover, size, x, y } = this;
    const s = size * 1.3;
    return `
      position: absolute;
      text-align: center;
      cursor: pointer;
      width: ${s}px;
      height: ${s}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: ${s / 2}px;
      line-height: ${s}px;
      background: ${hover ? '#ff0' : '#61dafb'};
    `;
  }
}


const halfTemplate = html<Triangle>`
        <f-dot :x=${(x) => x.x - HALF_TARGET_SIZE} :y=${(x) => x.y - HALF_TARGET_SIZE} :size=${() => TARGET_SIZE} :text=${(x) => x.text}></f-dot>
`;

const otherTemplate =  html<Triangle>`
  <f-triangle :x=${(x) => x.x} :y=${(x) => x.y - half(half(x.s))} :s=${(x) => half(x.s)} :text=${(x) => x.text}></f-triangle>
  <f-triangle :x=${(x) => x.x - half(x.s)} :y=${(x) => x.y + half(half(x.s))} :s=${(x) => half(x.s)} :text=${(x) => x.text}></f-triangle>
  <f-triangle :x=${(x) => x.x + half(x.s)} :y=${(x) => x.y + half(half(x.s))} :s=${(x) => half(x.s)} :text=${(x) => x.text}></f-triangle>
 `;
/**
 * ------------------------------------------------------------------------------------------
 * The Triangle Component
 * ------------------------------------------------------------------------------------------
 */
@customElement({
  name: 'f-triangle',
  template: halfTemplate,
})
export class Triangle extends FASTElement {
  public x = 0;
  public y = 0;
  public s = 1;
  public text = '';

  constructor() {
    super();
    observe(this, 'x', 'y', 's', 'text');
    Observable.getNotifier(this).subscribe({
      handleChange: () => {
        this.$fastController.template = this.s <= 25 ? halfTemplate : otherTemplate
      }
    }, "s");
  }
}


/**
 * ------------------------------------------------------------------------------------------
 * The Tree Component
 * ------------------------------------------------------------------------------------------
 */
@customElement({
  name: 'f-tree',
  template: html`
    <div style=${x => x.boxStyle()}>
      <f-triangle :s=${() => 1000} :text=${x => x.seconds}></f-triangle>
    </div>
  `,
})
export class Tree extends FASTElement {
  public seconds = 0;
  public elapsed = 0;
  private timer = -1;

  constructor() {
    super();
    observe(this, 'seconds', 'elapsed');
  }

  public boxStyle() {
    const t = (this.elapsed / 1000) % 10;
    const scale = 1 + (t > 5 ? 10 - t : t) / 10;
    return `
      position: absolute;
      transform: scaleX(${scale / 2.1}) scaleY(0.7) translateZ(0.1px);
      left: 50%;
      top: 50%;
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.timer = window.setInterval(() => {
      this.seconds = (this.seconds % 10) + 1;
    }, 1000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this.timer);
  }
}

/**
 * ------------------------------------------------------------------------------------------
 * The Animiation Component
 * ------------------------------------------------------------------------------------------
 */
@customElement({
  name: 'f-animation',
  template: html`
    <f-tree :elapsed=${x => x.time}></f-tree>
  `,
})
export class Animation extends FASTElement {
  private start = Date.now();
  private unmounted = false;
  public time = 0;

  constructor() {
    super();
    observe(this, 'time');
  }

  connectedCallback() {
    super.connectedCallback();
    const update = () => {
      if (this.unmounted) return;
      this.time = Date.now() - this.start;
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unmounted = true;
  }
}
