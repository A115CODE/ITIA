console.log('navbar ON');

const NAVBAR = document.createElement('nav');
NAVBAR.id = 'NAVBAR';
SYSTEM.appendChild(NAVBAR);
NAVBAR.classList.add('sidebar');

const NAV_HEADER = document.createElement('header');
NAV_HEADER.classList.add('sidebar-header');
NAV_HEADER.id = 'sidebarHeader';
NAVBAR.appendChild(NAV_HEADER);

const LOGO = document.createElement('img');
LOGO.id = 'LOGO';
LOGO.src = '../../assets/logo_white.png';
LOGO.alt = 'universales';
NAV_HEADER.appendChild(LOGO);

const BTNS_LIST = document.createElement('ul');
BTNS_LIST.classList.add('sidebar-menu');
BTNS_LIST.id = 'sidebarMenu';
NAVBAR.appendChild(BTNS_LIST);

function DEPLOY_BTN(btn, btn_id, img) {
  const TITLE = document.createElement('li');
  TITLE.textContent = btn;
  TITLE.id = btn_id;
  BTNS_LIST.appendChild(TITLE);

  const ICON = document.createElement('img');
  ICON.src = img;
  TITLE.appendChild(ICON);
}

DEPLOY_BTN('Dashboard', 'DASHBOARD', '../../assets/dashboard.svg');
DEPLOY_BTN('Tickets', 'TICKETS', '../../assets/tickets.svg');
DEPLOY_BTN('Agentes', 'AGENTES', '../../assets/agentes.svg');
DEPLOY_BTN('Equipos', 'EQUIPOS', '../../assets/equipos.svg');
DEPLOY_BTN('Reportes', 'REPORTES', '../../assets/reportes.svg');
DEPLOY_BTN('Configuraciones', 'CONFIGURACIONES', '../../assets/config.svg');
DEPLOY_BTN('Base Del Conocimiento', 'BASE_DEL_CONOCIMIENTO','../../assets/database.svg');

const sidebarHeader = document.getElementById('sidebarHeader');
const sidebarMenu = document.getElementById('sidebarMenu');

if (sidebarHeader && sidebarMenu) {
  sidebarHeader.addEventListener('click', function () {
    sidebarMenu.classList.toggle('expanded');
    sidebarHeader.classList.toggle('expanded');
  });
}
