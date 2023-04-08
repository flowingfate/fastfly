import { Observable } from '@microsoft/fast-element';

export function observe<T>(target: T, ...props: Array<keyof T>) {
  props.forEach((key) => {
    if (typeof key !== 'string') return;
    let temp = target[key];
    delete target[key];
    Object.defineProperty(target, key, {
      get() {
        Observable.track(target, key);
        return temp;
      },
      set(v) {
        temp = v;
        Observable.notify(target, key);
      },
    })
  });
}
