export function initLandingPage() {
  const links = document.querySelectorAll('[data-route]');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = `./${link.getAttribute('data-route')}`;
    });
  });
}
