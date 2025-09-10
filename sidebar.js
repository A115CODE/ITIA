// SIDEBAR
document.addEventListener('DOMContentLoaded', function () {
  const sidebarHeader = document.getElementById('sidebarHeader');
  const sidebarMenu = document.getElementById('sidebarMenu');

  sidebarHeader.addEventListener('click', function () {
    sidebarMenu.classList.toggle('expanded');
    sidebarHeader.classList.toggle('expanded');
  });
});
