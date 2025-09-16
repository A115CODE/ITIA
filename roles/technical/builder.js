function DEPLOY_SCRIPT(SRC) {
  const SCRIPT = document.createElement('script');
  SCRIPT.src = SRC;
  SCRIPT.defer = true; // intenta comportarse como defer
  document.body.appendChild(SCRIPT);
}
function DEPLOY_CSS(URL) {
  const CSS = document.createElement('link');
  CSS.rel = 'stylesheet';
  CSS.href = URL;
  document.head.appendChild(CSS);
}

DEPLOY_SCRIPT('./components/navbar/navbar.js');
DEPLOY_CSS('./components/navbar/navbar.css');

DEPLOY_SCRIPT('./modules/tickets/tickets.js');
DEPLOY_CSS('./modules/tickets/tickets.css');
