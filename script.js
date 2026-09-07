const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --------------------------------------------------------------------------
// Mobile nav toggle
// --------------------------------------------------------------------------
function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// --------------------------------------------------------------------------
// Portfolio tabs (Projects / Certificates / Tech Stack)
// --------------------------------------------------------------------------
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

// --------------------------------------------------------------------------
// Stat count-up: runs once, when the stats row scrolls into view
// --------------------------------------------------------------------------
function initStatCountUp() {
  const numbers = document.querySelectorAll(".stat-number");
  if (!numbers.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    let current = 0;
    const duration = 900;
    const steps = Math.max(target, 1);
    const stepTime = duration / steps;

    const interval = setInterval(() => {
      current++;
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, stepTime);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          numbers.forEach(animate);
          obs.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(document.querySelector(".stats"));
}

// --------------------------------------------------------------------------
// Copy email to clipboard
// --------------------------------------------------------------------------
function initCopyEmail() {
  const button = document.getElementById("copyEmail");
  const emailLink = document.getElementById("emailLink");
  if (!button || !emailLink) return;

  button.addEventListener("click", async () => {
    const email = emailLink.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      button.textContent = "Copied";
    } catch (err) {
      button.textContent = "Select & copy";
    }
    setTimeout(() => (button.textContent = "Copy"), 1800);
  });
}

// --------------------------------------------------------------------------
// Highlight active nav link based on scroll position
// --------------------------------------------------------------------------
function initActiveNav() {
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

// --------------------------------------------------------------------------
// Init
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initNavToggle();
  initTabs();
  initStatCountUp();
  initCopyEmail();
  initActiveNav();
});