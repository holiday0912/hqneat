import { debounce } from "throttle-debounce";
import { off, on } from "@/utils/dom";

let fn = null;
export default {
  name: "debounce",
  install(Vue, { defaultTime = 300 } = {}) {
    Vue.directive("debounce", {
      bind(el, { value, arg }) {
        fn = debounce(arg || defaultTime, value);
        on(el, "click", fn);
      },

      unbind(el) {
        if (fn) {
          off(el, "click", fn);
        }
      }
    });
  }
};
