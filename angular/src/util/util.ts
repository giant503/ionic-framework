import { HTMLStencilElement } from '../types/interfaces';

export const raf = (h: any) => {
  const win = window as any;
  return (win.__zone_symbol__requestAnimationFrame) ? win.__zone_symbol__requestAnimationFrame(h) : requestAnimationFrame(h);
};

export const proxyMethod = (ctrlName: string, doc: Document, methodName: string, ...args: any[]) => {
  const controller = ensureElementInBody(ctrlName, doc);
  return controller.componentOnReady()
    .then(() => (controller as any)[methodName].apply(controller, args));
};

export const ensureElementInBody = (elementName: string, doc: Document) => {
  let element = doc.querySelector(elementName);
  if (!element) {
    element = doc.createElement(elementName);
    doc.body.appendChild(element);
  }
  return element as HTMLStencilElement;
};
