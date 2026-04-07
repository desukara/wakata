const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const header = document.querySelector(".header");
const navLinks = document.querySelectorAll(".nav a");
const animatedItems = document.querySelectorAll(
  "[data-animate], .card, .hero-inner, .section"
);

/* =========================
   SAFETY HELPERS
========================= */
function isMenuOpen() {
  return nav && nav.classList.contains("open");
}

function openMenu() {
  if (!nav || !menuBtn) return;
  nav.classList.add("open");
  menuBtn.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  if (!nav || !menuBtn) return;
  nav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (!nav || !menuBtn) return;
  if (isMenuOpen()) {
    closeMenu();
  } else {
    openMenu();
  }
}

/* =========================
   MOBILE MENU
========================= */
if (menuBtn && nav) {
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Toggle navigation menu");

  menuBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = nav.contains(event.target);
    const clickedMenuBtn = menuBtn.contains(event.target);

    if (!clickedInsideNav && !clickedMenuBtn && isMenuOpen()) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1000) {
      closeMenu();
    }
  });
}

/* =========================
   ACTIVE NAV BY CURRENT FILE
========================= */
(function setActiveNav() {
  if (!navLinks.length) return;

  const path = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (href === path) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });
})();

/* =========================
   HEADER SCROLL STATE
========================= */
function handleHeaderScroll() {
  if (!header) return;

  if (window.scrollY > 24) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

handleHeaderScroll();
window.addEventListener("scroll", handleHeaderScroll, { passive: true });

/* =========================
   REVEAL SYSTEM
   Tokyo / 7 Samurai style:
   controlled rise, sharpen into view
========================= */
function applyRevealClasses() {
  animatedItems.forEach((item, index) => {
    if (!item.classList.contains("reveal")) {
      item.classList.add("reveal");
    }

    if (!item.hasAttribute("data-delay")) {
      const delayStep = Math.min(index * 80, 320);
      item.style.transitionDelay = `${delayStep}ms`;
    } else {
      item.style.transitionDelay = item.getAttribute("data-delay");
    }
  });
}

applyRevealClasses();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  animatedItems.forEach((item) => {
    revealObserver.observe(item);
  });
} else {
  animatedItems.forEach((item) => {
    item.classList.add("revealed");
  });
}

/* =========================
   PRESS FEEDBACK
   Controlled, subtle weight
========================= */
function addPressFeedback(selector) {
  const items = document.querySelectorAll(selector);

  items.forEach((item) => {
    item.addEventListener("pointerdown", () => {
      item.classList.add("is-pressing");
    });

    const removePress = () => {
      item.classList.remove("is-pressing");
    };

    item.addEventListener("pointerup", removePress);
    item.addEventListener("pointerleave", removePress);
    item.addEventListener("pointercancel", removePress);
  });
}

addPressFeedback(".btn");
addPressFeedback(".card");
addPressFeedback(".nav a");

/* =========================
   SECTION TAGGING FOR FUTURE SCALE
========================= */
document.querySelectorAll("section").forEach((section, index) => {
  if (!section.hasAttribute("data-section")) {
    section.setAttribute("data-section", `section-${index + 1}`);
  }
});
