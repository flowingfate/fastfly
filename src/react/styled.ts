const element = document.createElement('style');
document.head.append(element);
const sheet = element.sheet!;

function uuid() {
  return 's-' + Math.round((Math.random() + 1) * Date.now()).toString(36);
}

function insert(head: string, body: string) {
  sheet.insertRule(`${head} {${body}}`);
}

function compose(list: string[], templates: Array<string | number>) {
  let body = list[0];
  for (let i = 0, c = templates.length; i < c; i += 1) {
    body += templates[i] + list[i + 1];
  }
  return body;
}

export function css(list: any, ...templates: Array<string | number>) {
  const id = uuid();
  insert('.' + id, compose(list, templates));
  return id;
}

export function keyframes(list: any, ...templates: Array<string | number>) {
  const id = uuid();
  insert('@keyframes ' + id, compose(list, templates));
  return id;
}

export function istyled(cls: string) {
  return (list: any, ...templates: Array<string | number>) => {
    insert(cls, compose(list, templates));
  };
}
