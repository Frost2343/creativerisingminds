/* ===============================
   NAVBAR USER LOGIN UI HANDLER
=============================== */

function updateUserMenu() {
  const user = getCurrentUser();
  const loggedOutMenu = document.getElementById('userIconLoggedOut');
  const loggedInMenu = document.getElementById('userIconLoggedIn');
  const userNameNav = document.getElementById('userNameNav');

  if (!loggedOutMenu || !loggedInMenu) return; // Some pages may not have nav

  if (user) {
    loggedOutMenu.style.display = 'none';
    loggedInMenu.style.display = 'flex';

    const displayName = user.user_metadata?.full_name
      ? user.user_metadata.full_name.split(' ')[0]
      : user.email.split('@')[0];

    if (userNameNav) userNameNav.textContent = displayName;
  } else {
    loggedOutMenu.style.display = 'flex';
    loggedInMenu.style.display = 'none';
  }
}

/* ===============================
   DROPDOWN BEHAVIOUR
=============================== */
function toggleDropdown(event) {
  event.stopPropagation();
  const userIcon = event.currentTarget;
  const dropdown = userIcon.querySelector('.dropdown-menu');
  const isActive = dropdown.classList.contains('active');

  document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('active'));
  document.querySelectorAll('.dropdown-overlay').forEach(o => o.remove());
  document.body.classList.remove('dropdown-open');

  if (!isActive) {
    dropdown.classList.add('active');
    const overlay = document.createElement('div');
    overlay.className = 'dropdown-overlay';
    userIcon.appendChild(overlay);
    document.body.classList.add('dropdown-open');
  }
}

function closeDropdown(event) {
  const userMenu = document.querySelector('.user-menu');
  if (userMenu && !userMenu.contains(event.target)) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('active'));
    document.querySelectorAll('.dropdown-overlay').forEach(o => o.remove());
    document.body.classList.remove('dropdown-open');
  }
}

function handleDropdownItemClick() {
  document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('active'));
  document.querySelectorAll('.dropdown-overlay').forEach(o => o.remove());
  document.body.classList.remove('dropdown-open');
}

/* ===============================
   INITIALIZE ON PAGE LOAD
=============================== */
document.addEventListener('DOMContentLoaded', () => {
  updateUserMenu();

  const userIcons = document.querySelectorAll('.user-icon');
  userIcons.forEach(icon => icon.addEventListener('click', toggleDropdown));

  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => item.addEventListener('click', handleDropdownItemClick));

  document.addEventListener('click', closeDropdown);
});
