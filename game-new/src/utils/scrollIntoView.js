function scrollParent(element, includeHidden) {
  // from jQuery UI
  const position = window.getComputedStyle(element).position;
  if (position === "fixed") {
    return element.ownerDocument || document;
  }
  const excludeStaticParent = (position === "absolute");
  const overflowRegex = (includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/);

  let parent = element.parentNode;
  while (parent && parent.nodeType !== 9) {
    if (parent.nodeType === 1) {
      const style = window.getComputedStyle(parent);
      if (excludeStaticParent && style.position === "static") {
        // no
      } else if (overflowRegex.test(style.overflow + style.overflowX + style.overflowY)) {
        return parent;
      }
    }
    parent = parent.parentNode;
  }
  return element.ownerDocument || document;
}

function scrollIntoView(element, padding=60) {
  const parent = scrollParent(element);
  const rect = element.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  const parentStyle = window.getComputedStyle(parent);

  const parentLeft = parentRect.left + parseFloat(parentStyle.borderLeftWidth);
  const parentTop = parentRect.top + parseFloat(parentStyle.borderTopWidth);
  const left = rect.left - parentLeft;
  const top = rect.top - parentTop;
  const right = rect.right - parentLeft;
  const bottom = rect.bottom - parentTop;

  const deltaLeft = Math.min(left - padding, left >= parent.clientWidth ?
    (left + right - parent.clientWidth) / 2 : Math.max(right + padding - parent.clientWidth, 0));
  const deltaTop = Math.min(top - padding, top >= parent.clientHeight ?
    (top + bottom - parent.clientHeight) / 2 : Math.max(bottom + padding - parent.clientHeight, 0));
  if (deltaLeft) parent.scrollLeft += deltaLeft;
  if (deltaTop) parent.scrollTop += deltaTop;
}

export { scrollParent, scrollIntoView };
export default scrollIntoView;
