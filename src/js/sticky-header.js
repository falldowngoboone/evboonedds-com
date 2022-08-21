// TODO: reinitialize on resize? DOM mutation?
// TODO: add x-scroll-up and x-scroll-down classes on body
// TODO: toggle a sticky class on the sticky target; maybe add the threshold to a custom property?
// The idea is we push all style responsibility over completely to CSS.
// I think we should remove the x-scroll-up class when the user reaches the top of the page.
// This will mimic the reinitialization I'm currently doing.

const header = document.getElementById('site-header');
let stickyThreshold = header.getBoundingClientRect().height;
document.documentElement.style.setProperty('--header-height', stickyThreshold);

const DIRECTION = {
  UP: 'UP',
  DOWN: 'DOWN',
};
let lastScrollY = 0;

window.addEventListener('scroll', function () {
  const { scrollY } = window;

  if (scrollY > stickyThreshold && !header.classList.contains('sticky')) {
    header.classList.add('sticky');
  } else if (scrollY <= 0) {
    header.classList.remove('sticky');
  }

  const direction = scrollY < lastScrollY ? DIRECTION.UP : DIRECTION.DOWN;
  const velocity = Math.abs(scrollY - lastScrollY);

  if (scrollY <= 0) {
    document.body.classList.remove('x-scroll-down');
    document.body.classList.remove('x-scroll-up');
  } else if (direction === DIRECTION.UP && velocity >= 10) {
    document.body.classList.remove('x-scroll-down');
    document.body.classList.add('x-scroll-up');
  } else if (direction === DIRECTION.DOWN && velocity >= 5) {
    document.body.classList.remove('x-scroll-up');
    document.body.classList.add('x-scroll-down');
  }

  lastScrollY = scrollY;
});

window.addEventListener('resize', debounce(reinitialize, 500));

function reinitialize() {
  stickyThreshold = Math.ceil(header.getBoundingClientRect().height);
  document.documentElement.style.setProperty(
    '--header-height',
    stickyThreshold
  );
}

function debounce(fn, delay) {
  let cancelId;
  return (...args) => {
    clearTimeout(cancelId);
    cancelId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
