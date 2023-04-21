import { FASTElement, customElement, html, repeat, Controller } from '@microsoft/fast-element';
import { observe } from './observe';
import { rowStyle, actionStyle, tableStyle } from './table.style';

function random(max: number) {
  return Math.round(Math.random() * 1000) % max;
}

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

interface RowItem {
  id: number;
  label: string;
}
let nextId = 1;
function buildData(count: number) {
  const list: RowItem[] = [];
  for (let i = 0; i < count; i++) {
    list.push({
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    });
  }
  return list;
}

/**
 * ------------------------------------------------------------------------------------------
 * The Row Component
 * ------------------------------------------------------------------------------------------
 */
@customElement({
  name: 'f-row',
  styles: rowStyle,
  elementOptions: { extends: 'tr' },
  shadowOptions: null,
  template: html`
      <td class="col col-1">${x => x.item.id}</td>
      <td class="col col-2">${x => x.item.label}</td>
      <td class="col col-3">
        <a @click=${x => x.delete(x.item)}>Delete</a>
      </td>
      <td class="col col-4">
        <a @click=${x => x.select(x.item)}>Select</a>
      </td>
  `,
})
export class Row extends HTMLTableRowElement {
  public readonly $fastController: Controller;

  public item!: RowItem;
  public select = (item: RowItem) => {};
  public delete = (item: RowItem) => {};

  constructor() {
    super();
    this.$fastController = Controller.forCustomElement(this);
    observe(this, 'item', 'select', 'delete');
  }

  public $emit(
    type: string,
    detail?: any,
    options?: Omit<CustomEventInit, "detail">
  ) {
    return this.$fastController.emit(type, detail, options);
  }

  public connectedCallback(): void {
    this.$fastController.onConnectedCallback();
  }

  public disconnectedCallback(): void {
    this.$fastController.onDisconnectedCallback();
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    this.$fastController.onAttributeChangedCallback(name, oldValue, newValue);
  }
}

/**
 * ------------------------------------------------------------------------------------------
 * The Actions Component
 * ------------------------------------------------------------------------------------------
 */
@customElement({
  name: 'f-actions',
  styles: actionStyle,
  template: html`
    <div class="actions">
      <button @click=${x => x.run(1000)}>Create 1,000 rows</button>
      <button @click=${x => x.run(10000)}>Create 10,000 rows</button>
      <button @click=${x => x.add()}>Append 1,000 rows</button>
      <button @click=${x => x.update()}>Update every 10th row</button>
      <button @click=${x => x.clear()}>Clear all rows</button>
      <button @click=${x => x.swap()}>Swap rows</button>
    </div>
  `,
})
export class Actions extends FASTElement {
  /* inject by parent */
  public setList = (cb: (list: RowItem[]) => RowItem[]) => {};
  public setSelect = (id: number) => {};

  constructor() {
    super();
    observe(this, 'setList', 'setSelect');
  }

  public run(n: number) {
    this.setList(() => buildData(n));
    this.setSelect(0);
  }

  public add() {
    this.setList(list => [...list, ...buildData(1000)]);
  }

  public update() {
    this.setList((list) => {
      const data = list.slice();
      for (let i = 0; i < data.length; i += 10) {
        const item = data[i];
        data[i] = { id: item.id, label: item.label + " !!!" };
      }
      return data;
    });
  }

  public clear() {
    this.setList(() => []);
    this.setSelect(0);
  }

  public swap() {
    this.setList((list) => {
      const data = list.slice();
      if (data.length > 998) {
        let temp = data[1];
        data[1] = data[998];
        data[998] = temp;
      }
      return data;
    });
  }
}



const repeatRowTmpl = html`
  <tr is="f-row"
    class="row ${(r, c) => (r.id === c.parent.selected) ? 'selected' : ''}"
    :item=${r => r}
    :selected=${(r, c) => (r.id === c.parent.selected)}
    :select=${(_, c) => c.parent.select}
    :delete=${(_, c) => c.parent.delete}
  ></tr>
`;
/**
 * ------------------------------------------------------------------------------------------
 * The Table Component
 * ------------------------------------------------------------------------------------------
 */
@customElement({
  name: 'f-table',
  styles: tableStyle,
  template: html`
    <div class="container">
      <h1 class="title">Fast table</h1>
      <f-actions :setList=${x => x.setList} :setSelect=${x => x.setSelect}></f-actions>
      <table class="rc-table">
        <tbody>
          ${repeat(x => x.list, repeatRowTmpl)}
        </tbody>
      </table>
    </div>
  `,
})
export class Table extends FASTElement {
  public selected = 0;
  public list: RowItem[] = [];

  constructor() {
    super();
    observe(this, 'selected', 'list');
  }

  public setList = (cb: (list: RowItem[]) => RowItem[]) => {
    this.list = cb(this.list);
  };

  public setSelect = (id: number) => {
    this.selected = id;
  };

  public select = (item: RowItem) => {
    this.selected = item.id;
  };

  public delete = (item: RowItem) => {
    this.list = this.list.filter(r => r.id !== item.id);
  };
}
