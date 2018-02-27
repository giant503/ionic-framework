
const RELOCATED_KEY= '$ionRelocated';

export default function enableHideCaretOnScroll(componentEl: HTMLElement, inputEl: HTMLInputElement, scrollEl: HTMLIonScrollElement, keyboardHeight: number) {
  if(!scrollEl || !inputEl) {
    return () => {};
  }
  console.debug('Input: enableHideCaretOnScroll');

  const scrollHideCaret = (shouldHideCaret: boolean) => {
    // console.log('scrollHideCaret', shouldHideCaret)
    if (isFocused(inputEl)) {
      relocateInput(componentEl, inputEl, keyboardHeight, shouldHideCaret);
    }
  };

  const onBlur = () => relocateInput(componentEl, inputEl, keyboardHeight, false);
  const hideCaret = () => scrollHideCaret(true);
  const showCaret = () => scrollHideCaret(false);

  scrollEl && scrollEl.addEventListener('ionScrollStart', hideCaret);
  scrollEl && scrollEl.addEventListener('ionScrollEnd', showCaret);
  inputEl.addEventListener('blur', onBlur);

  return () => {
    scrollEl.removeEventListener('ionScrollStart', hideCaret);
    scrollEl.removeEventListener('ionScrollEnd', showCaret);
    inputEl.addEventListener('ionBlur', onBlur);
  };
}


function removeClone(componentEl: HTMLElement, inputEl: HTMLElement) {
  if (componentEl && componentEl.parentElement) {
    const clonedInputEles = componentEl.parentElement.querySelectorAll('.cloned-input');
    for (let i = 0; i < clonedInputEles.length; i++) {
      clonedInputEles[i].parentNode.removeChild(clonedInputEles[i]);
    }
    componentEl.style.pointerEvents = '';
  }
  (<any>inputEl.style)['transform'] = '';
  inputEl.style.opacity = '';
}

function cloneInputComponent(componentEl: HTMLElement, inputEl: HTMLInputElement) {
  // Make sure we kill all the clones before creating new ones
  // It is a defensive, removeClone() should do nothing
  // removeClone(plt, srcComponentEle, srcNativeInputEle);
  // given a native <input> or <textarea> element
  // find its parent wrapping component like <ion-input> or <ion-textarea>
  // then clone the entire component
  const parentElement = componentEl.parentElement;
  if (componentEl && parentElement) {
    // DOM READ
    const srcTop = componentEl.offsetTop;
    const srcLeft = componentEl.offsetLeft;
    const srcWidth = componentEl.offsetWidth;
    const srcHeight = componentEl.offsetHeight;

    // DOM WRITE
    // not using deep clone so we don't pull in unnecessary nodes
    const clonedComponentEle = document.createElement('div');
    const clonedStyle = clonedComponentEle.style;
    clonedComponentEle.classList.add(...Array.from(componentEl.classList));
    clonedComponentEle.classList.add('cloned-input');
    clonedComponentEle.setAttribute('aria-hidden', 'true');
    clonedStyle.pointerEvents = 'none';
    clonedStyle.position = 'absolute';
    clonedStyle.top = srcTop + 'px';
    clonedStyle.left = srcLeft + 'px';
    clonedStyle.width = srcWidth + 'px';
    clonedStyle.height = srcHeight + 'px';

    const clonedInputEl = document.createElement('input');
    clonedInputEl.classList.add(...Array.from(inputEl.classList));
    // Object.assign(clonedInputEl, input);
    //const clonedInputEl = <HTMLInputElement>inputEl.cloneNode(false);
    clonedInputEl.value = inputEl.value;
    clonedInputEl.type = inputEl.type;

    clonedInputEl.tabIndex = -1;

    clonedComponentEle.appendChild(clonedInputEl);
    parentElement.appendChild(clonedComponentEle);

    componentEl.style.pointerEvents = 'none';
  }
  inputEl.style.transform = 'scale(0)';
}

function relocateInput(
  componentEl: HTMLElement,
  inputEle: HTMLInputElement,
  _keyboardHeight: number,
  shouldRelocate: boolean
) {
  console.log('relocateInput',shouldRelocate );
  if ((componentEl as any)[RELOCATED_KEY] === shouldRelocate) {
    return;
  }
  console.debug(`native-input, hideCaret, shouldHideCaret: ${shouldRelocate}, input value: ${inputEle.value}`);
  if (shouldRelocate) {
    // this allows for the actual input to receive the focus from
    // the user's touch event, but before it receives focus, it
    // moves the actual input to a location that will not screw
    // up the app's layout, and does not allow the native browser
    // to attempt to scroll the input into place (messing up headers/footers)
    // the cloned input fills the area of where native input should be
    // while the native input fakes out the browser by relocating itself
    // before it receives the actual focus event
    // We hide the focused input (with the visible caret) invisiable by making it scale(0),
    cloneInputComponent(componentEl, inputEle);
    // TODO
    // const inputRelativeY = getScrollData(componentEl, inputEle, keyboardHeight).scrollAmount;
    // const inputRelativeY = 9999;
    // fix for #11817
    const tx = document.dir === 'rtl' ? 9999 : -9999;
    inputEle.style.transform= `translate3d(${tx}px,${0}px,0)`;
    // inputEle.style.opacity = '0';

  } else {
    removeClone(componentEl, inputEle);
  }
  (componentEl as any)[RELOCATED_KEY] = shouldRelocate;
}

function isFocused(input: HTMLInputElement): boolean {
  return input === document.activeElement;
}
