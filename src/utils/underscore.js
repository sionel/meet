export const debounce = (fn, delay) => {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
};

export const throttle = (fn, delay) => {
  let timer;
  return function() {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, arguments);
      }, delay);
    }
  };
};

export default {
  debounce,
  throttle
};
