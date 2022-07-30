const mqList = window.matchMedia('(max-width: 900px)');

function toggleCollapsibleNav(e) {
  if (e.matches) {
    const collapsibleNav = document
      .getElementById('collapsible-site-nav-template')
      .content.cloneNode(true);
    const nav = document.getElementById('site-nav');

    nav?.replaceWith(collapsibleNav);
  } else {
    const nav = document
      .getElementById('site-nav-template')
      .content.cloneNode(true);
    const collapsibleNav = document.getElementById('collapsible-site-nav');

    collapsibleNav?.replaceWith(nav);
  }
}

toggleCollapsibleNav(mqList);

mqList.addEventListener('change', toggleCollapsibleNav);
