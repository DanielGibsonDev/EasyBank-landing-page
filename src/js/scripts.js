// Clicking Hamburger mobile icon opens mobile menu

const hamburgerOpen = document.getElementById("mobile-open");
const hamburgerClose = document.getElementById("mobile-close");
const mobileNav = document.getElementById("popup-nav");

hamburgerOpen.addEventListener('click', event => {
  event.preventDefault();
  hamburgerOpen.classList.toggle("hidden");
  hamburgerClose.classList.toggle("hidden");
  mobileNav.classList.toggle("hidden");
}, false);

hamburgerClose.addEventListener('click', event => {
  event.preventDefault();
  hamburgerClose.classList.toggle("hidden");
  hamburgerOpen.classList.toggle("hidden");
  mobileNav.classList.toggle("hidden");
}, false);

window.onclick = function (event) {
  if (event.target === mobileNav) {
    mobileNav.classList.toggle("hidden");
    hamburgerOpen.classList.toggle("hidden");
    hamburgerClose.classList.toggle("hidden");
  }
}
