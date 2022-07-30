const disclosureSet = new Set();
const handlerMap = new WeakMap();

function isInPage(node) {
  return node === document.body ? false : document.body.contains(node);
}

function initialize(disclosure) {
  // if the user clicks a link or clicks outside of the disclosure,
  // close the disclosure
  function handleClick(event) {
    if (
      !disclosure.contains(event.target) ||
      event.target.matches('a') ||
      event.target.closest('a')
    ) {
      disclosure.open = false;
    }
  }

  function handleToggle() {
    if (disclosure.open) {
      document.documentElement.addEventListener('click', handleClick);
    } else {
      document.documentElement.removeEventListener('click', handleClick);
    }
  }

  disclosure.addEventListener('toggle', handleToggle);

  handlerMap.set(disclosure, handleToggle);

  if (disclosure.open) {
    document.documentElement.addEventListener('click', handleClick);
  }
}

function tearDown(disclosure) {
  const toggleHandler = handlerMap.get(disclosure);
  if (typeof toggleHandler === 'function') {
    disclosure.removeEventListener('toggle', toggleHandler);
  }
}

function initializeDisclosures() {
  for (const disclosure of disclosureSet) {
    if (!isInPage(disclosure)) {
      tearDown(disclosure);
      disclosureSet.delete(disclosure);
    }
  }

  const disclosures = document.querySelectorAll('[data-disclosure]');

  for (const disclosure of disclosures.values()) {
    if (!disclosureSet.has(disclosure)) {
      initialize(disclosure);
      disclosureSet.add(disclosure);
    }
  }
}

initializeDisclosures();

function handleInitOnMutate(mutations) {
  mutations.forEach((mutation) => {
    switch (mutation.type) {
      case 'childList': {
        initializeDisclosures();
      }
    }
  });
}

const observer = new MutationObserver(handleInitOnMutate);
observer.observe(document.body, { childList: true, subtree: true });
