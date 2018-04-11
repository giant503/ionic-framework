import { CssClassMap } from '../index';

/**
 * Create the mode and color classes for the component based on the classes passed in
 */
export function createThemedClasses(mode: string, color: string, classes: string): CssClassMap {
  const classObj: CssClassMap = {};

  classes.split(' ').forEach(classString => {
    classObj[classString] = true;

    if (mode) {
      classObj[`${classString}-${mode}`] = true;

      if (color) {
        classObj[`${classString}-${color}`] = true;
        classObj[`${classString}-${mode}-${color}`] = true;
      }
    }

    return classObj;
  });
  return classObj;
}

/**
 * Get the classes from a class list and return them as an object
 */
export function getElementClassMap(classList: DOMTokenList | string[]): CssClassMap {
  const classObj: CssClassMap = {};

  for (let i = 0; i < classList.length; i++) {
    classObj[classList[i]] = true;
  }

  return classObj;
}

/**
 * Get the classes based on the button type
 * e.g. alert-button, action-sheet-button
 */
export function getButtonClassMap(buttonType: string, mode: string): CssClassMap {
  if (!buttonType) {
    return {};
  }
  return {
    [buttonType]: true,
    [`${buttonType}-${mode}`]: true
  };
}

export function getClassList(classes: string | string[] | undefined): string[] {
  if (classes) {
    if (Array.isArray(classes)) {
      return classes;
    }
    return classes
      .split(' ')
      .filter(c => c.trim() !== '');
  }
  return [];
}

export function getClassMap(classes: string | string[] | undefined): CssClassMap {
  const map: CssClassMap = {};
  getClassList(classes).forEach(c => map[c] = true);
  return map;
}

export type RouterDirection = 'forward' | 'back';

export async function openURL(url: string, ev: Event, direction: RouterDirection = 'forward') {
  if (url && url[0] !== '#' && url.indexOf('://') === -1) {
    const router = document.querySelector('ion-router');
    if (router) {
      ev && ev.preventDefault();
      await router.componentOnReady();
      return router.push(url, direction === 'back' ? -1 : 1);
    }
  }
  return Promise.resolve();
}
