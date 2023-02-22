/**
 * 为元素添加事件监听
 */
export const on = (function() {
  if (document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if ((element, event, handler)) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

/**
 * 为元素解除事件监听
 */
export const off = function() {
  if (document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
};
