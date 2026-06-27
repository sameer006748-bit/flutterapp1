export function initRouter() {
  const current = window.location.pathname.split('/').pop() || 'dashboard.html';
  const links = document.querySelectorAll('[data-route]');
  links.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('data-route') === current);
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = `./${link.getAttribute('data-route')}`;
    });
  });
}
