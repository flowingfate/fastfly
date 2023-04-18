import React, { memo, useCallback, useState } from "react";
import './table.style.css';

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
interface RowProps {
  item: RowItem;
  selected?: boolean;
  select: (item: RowItem) => void;
  remove: (item: RowItem) => void;
}
const Row = memo<RowProps>(({ item, selected, select, remove }) => {
  return (
    <tr className={selected ? "row selected" : "row"}>
      <td className="col col-1">{item.id}</td>
      <td className="col col-2">{item.label}</td>
      <td className="col col-3">
        <a onClick={() => remove(item)}>Delete</a>
      </td>
      <td className="col col-4">
        <a onClick={() => select(item)}>Select</a>
      </td>
    </tr>
  );
}, (o, n) => (o.item === n.item && o.selected === n.selected));


/**
 * ------------------------------------------------------------------------------------------
 * The Actions Component
 * ------------------------------------------------------------------------------------------
 */
interface ActionProps {
  setList: (cb: (list: RowItem[]) => RowItem[]) => void;
  setSelect: (id: number) => void;
}
const Actions = memo<ActionProps>(({ setList, setSelect }) => {
  function run(n: number) {
    setList(() => buildData(n));
    setSelect(0);
  }
  function add() {
    setList(list => [...list, ...buildData(1000)]);
  }
  function update() {
    setList((list) => {
      const data = list.slice();
      for (let i = 0; i < data.length; i += 10) {
        const item = data[i];
        data[i] = { id: item.id, label: item.label + " !!!" };
      }
      return data;
    });
  }
  function clear() {
    setList(() => []);
    setSelect(0);
  }
  function swap() {
    setList((list) => {
      const data = list.slice();
      if (data.length > 998) {
        let temp = data[1];
        data[1] = data[998];
        data[998] = temp;
      }
      return data;
    });
  }

  return (
    <div className="actions">
      <button onClick={() => run(1000)}>Create 1,000 rows</button>
      <button onClick={() => run(10000)}>Create 10,000 rows</button>
      <button onClick={add}>Append 1,000 rows</button>
      <button onClick={update}>Update every 10th row</button>
      <button onClick={clear}>Clear all rows</button>
      <button onClick={swap}>Swap rows</button>
    </div>
  );
});


/**
 * ------------------------------------------------------------------------------------------
 * The Table Component
 * ------------------------------------------------------------------------------------------
 */
export function Table() {
  const [selected, setSelect] = useState(0);
  const [list, setList] = useState<RowItem[]>([]);

  const select = useCallback((item: RowItem) => setSelect(item.id), []);
  const remove = useCallback((item: RowItem) => setList(list => list.filter(r => r.id !== item.id)), []);

  return (
    <div className="container">
      <h1 className="title">React table</h1>
      <Actions setList={setList} setSelect={setSelect} />
      <table className="rc-table">
        <tbody>
          {list.map((item, i) => (
            <Row key={i} item={item} selected={selected === item.id} select={select} remove={remove}></Row>
          ))}
        </tbody>
      </table>
    </div>
  );
}
