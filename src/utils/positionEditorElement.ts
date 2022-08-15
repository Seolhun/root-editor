export function positionEditorElement(
  editor: HTMLElement,
  rect: ClientRect | null,
  rootElement: HTMLElement | null,
): void {
  if (rect === null) {
    editor.style.opacity = '0';
    editor.style.top = '-1000px';
    editor.style.left = '-1000px';
  } else {
    editor.style.opacity = '1';
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    const left = rect.left - editor.offsetWidth / 2 + rect.width / 2;
    if (rootElement) {
      const rootElementRect = rootElement.getBoundingClientRect();
      if (rootElementRect.left > left) {
        editor.style.left = `${rect.left + window.pageXOffset}px`;
      } else if (left + editor.offsetWidth > rootElementRect.right) {
        editor.style.left = `${rect.right + window.pageXOffset - editor.offsetWidth}px`;
      }
    }
  }
}
