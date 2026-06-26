/* =====================================================================
   Sterling & Vale Advisory — script.js
   Vanilla JS, no dependencies. Modules:
     1. Mobile nav toggle
     2. Sticky-header shadow on scroll
     3. Smooth scroll (with sticky-offset) for anchor links
     4. IntersectionObserver scroll-in reveals
     5. Testimonial carousel (auto-rotate, prev/next, dots)
     6. Enquiry form: validation + FormSubmit AJAX
     7. Footer year
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------------------
     1. MOBILE NAV TOGGLE
  -------------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  const closeNav = () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close the mobile menu after tapping a link
  navMenu.addEventListener("click", (e) => {
    if (e.target.closest(".nav-link")) closeNav();
  });

  /* --------------------------------------------------------------
     2. STICKY-HEADER SHADOW ON SCROLL
  -------------------------------------------------------------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --------------------------------------------------------------
     3. SMOOTH SCROLL WITH STICKY-HEADER OFFSET
     (CSS scroll-behavior handles the rest; this corrects the
     anchor landing position so the sticky header doesn't overlap.)
  -------------------------------------------------------------- */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;
      window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });

      // Move focus for accessibility without an extra scroll jump
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* --------------------------------------------------------------
     4. INTERSECTION OBSERVER — SCROLL-IN REVEALS
  -------------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* --------------------------------------------------------------
     5. TESTIMONIAL CAROUSEL
  -------------------------------------------------------------- */
  (function carousel() {
    const track = document.getElementById("carouselTrack");
    if (!track) return;
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");
    const dotsWrap = document.getElementById("carouselDots");
    const total = slides.length;
    let index = 0;
    let timer = null;
    const INTERVAL = 6000;

    // Build dot indicators
    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
      dot.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(dot);
      return dot;
    });

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) =>
        dot.setAttribute("aria-selected", String(i === index))
      );
    }
    function goTo(i, fromUser) {
      index = (i + total) % total;
      update();
      if (fromUser) restart();
    }
    const next = (fromUser) => goTo(index + 1, fromUser);
    const prev = (fromUser) => goTo(index - 1, fromUser);

    function start() {
      if (prefersReduced) return;
      timer = window.setInterval(() => next(false), INTERVAL);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    nextBtn.addEventListener("click", () => next(true));
    prevBtn.addEventListener("click", () => prev(true));

    // Pause on hover/focus for readability
    const root = document.getElementById("carousel");
    ["mouseenter", "focusin"].forEach((ev) => root.addEventListener(ev, stop));
    ["mouseleave", "focusout"].forEach((ev) => root.addEventListener(ev, start));

    // Keyboard arrows when carousel has focus
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(true); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); prev(true); }
    });

    update();
    start();
  })();

  /* --------------------------------------------------------------
     6. ENQUIRY FORM — VALIDATION + FORMSUBMIT AJAX
  -------------------------------------------------------------- */
  (function enquiryForm() {
    const form = document.getElementById("enquiryForm");
    if (!form) return;

    const submitBtn = document.getElementById("submitBtn");
    const statusEl = document.getElementById("formStatus");
    const successEl = document.getElementById("formSuccess");

    // FormSubmit AJAX endpoint. // REPLACE_WITH_YOUR_EMAIL
    const ENDPOINT = "https://formsubmit.co/ajax/angch@tertiaryinfotech.com";

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const fields = {
      name: { el: form.name, errEl: document.getElementById("err-name") },
      email: { el: form.email, errEl: document.getElementById("err-email") },
      phone: { el: form.phone, errEl: document.getElementById("err-phone") },
      message: { el: form.message, errEl: document.getElementById("err-message") },
    };

    function setError(field, msg) {
      field.errEl.textContent = msg || "";
      field.el.setAttribute("aria-invalid", msg ? "true" : "false");
    }

    function validate() {
      let valid = true;

      if (!fields.name.el.value.trim()) {
        setError(fields.name, "Please enter your full name."); valid = false;
      } else setError(fields.name, "");

      const email = fields.email.el.value.trim();
      if (!email) {
        setError(fields.email, "Please enter your email address."); valid = false;
      } else if (!EMAIL_RE.test(email)) {
        setError(fields.email, "Please enter a valid email address."); valid = false;
      } else setError(fields.email, "");

      if (!fields.message.el.value.trim()) {
        setError(fields.message, "Please tell us a little about your enquiry."); valid = false;
      } else setError(fields.message, "");

      return valid;
    }

    // Clear an error as the user corrects it
    Object.values(fields).forEach((field) => {
      field.el.addEventListener("input", () => {
        if (field.el.getAttribute("aria-invalid") === "true") setError(field, "");
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      statusEl.textContent = "";
      statusEl.classList.remove("is-error");

      // Honeypot caught a bot — silently succeed without sending
      if (form._honey.value) {
        showSuccess();
        return;
      }

      if (!validate()) {
        statusEl.textContent = "Please fix the highlighted fields.";
        statusEl.classList.add("is-error");
        // Focus the first invalid field
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const payload = {
        name: fields.name.el.value.trim(),
        email: fields.email.el.value.trim(),
        phone: fields.phone.el.value.trim(),
        interest: form.interest.value,
        message: fields.message.el.value.trim(),
        // FormSubmit helper fields
        _subject: "🔔 New Free Wealth Health Check request — Sterling & Vale website",
        _template: "table",
        _captcha: "false",
      };

      submitBtn.disabled = true;
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = "Sending…";

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`Request failed (${res.status})`);

        const data = await res.json();
        // FormSubmit returns { success: "true" } on success
        if (data && (data.success === "true" || data.success === true)) {
          showSuccess();
        } else {
          throw new Error(data && data.message ? data.message : "Unexpected response");
        }
      } catch (err) {
        statusEl.textContent =
          "Sorry — something went wrong sending your enquiry. Please try again, or email us directly.";
        statusEl.classList.add("is-error");
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });

    function showSuccess() {
      form.reset();
      form.hidden = true;
      successEl.hidden = false;
      successEl.setAttribute("tabindex", "-1");
      successEl.focus({ preventScroll: true });
      announce(
        "Hurray, thank you for your submission, we will get back to you in 1 business day"
      );
      launchBalloons();
    }

    // Speak the confirmation message via the Web Speech API (best-effort).
    function announce(text) {
      try {
        const synth = window.speechSynthesis;
        if (!synth || typeof SpeechSynthesisUtterance === "undefined") return;
        synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 1;
        utter.pitch = 1;
        utter.volume = 1;
        synth.speak(utter);
      } catch (_) {
        /* speech unsupported — no-op */
      }
    }

    // Float a burst of celebratory balloons up the screen, then clean up.
    function launchBalloons() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const layer = document.createElement("div");
      layer.className = "balloon-layer";
      layer.setAttribute("aria-hidden", "true");

      const colors = [
        "#c8a96a", // muted gold accent
        "#1f2a44", // deep navy
        "#5b6b8c", // slate
        "#e6c98f",
        "#9fb0cf",
      ];
      const COUNT = 24;

      for (let i = 0; i < COUNT; i++) {
        const balloon = document.createElement("span");
        balloon.className = "balloon";
        balloon.style.left = Math.random() * 100 + "vw";
        balloon.style.background = colors[i % colors.length];
        balloon.style.animationDuration = 4 + Math.random() * 3 + "s";
        balloon.style.animationDelay = Math.random() * 1.2 + "s";
        balloon.style.transform = "scale(" + (0.7 + Math.random() * 0.6) + ")";
        layer.appendChild(balloon);
      }

      document.body.appendChild(layer);
      setTimeout(() => layer.remove(), 8000);
    }
  })();

  /* --------------------------------------------------------------
     7. WHATSAPP CHAT WIDGET
     Floating launcher + panel of suggested queries. Clicking a
     suggestion (or sending a typed message) opens a WhatsApp chat
     deep-link to the firm's number with the message pre-filled.
  -------------------------------------------------------------- */
  (function whatsappWidget() {
    const widget = document.getElementById("waWidget");
    if (!widget) return;

    const PHONE = "6596983731"; // Sterling & Vale WhatsApp (intl format, no +)

    const launcher = document.getElementById("waLauncher");
    const panel = document.getElementById("waPanel");
    const closeBtn = document.getElementById("waClose");
    const suggestions = document.getElementById("waSuggestions");
    const compose = document.getElementById("waCompose");
    const input = document.getElementById("waInput");

    function openWhatsApp(message) {
      const url =
        "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(message);
      window.open(url, "_blank", "noopener");
    }

    function openPanel() {
      panel.hidden = false;
      widget.classList.add("open");
      launcher.setAttribute("aria-expanded", "true");
      launcher.setAttribute("aria-label", "Close WhatsApp chat");
      input.focus({ preventScroll: true });
    }
    function closePanel() {
      panel.hidden = true;
      widget.classList.remove("open");
      launcher.setAttribute("aria-expanded", "false");
      launcher.setAttribute("aria-label", "Chat on WhatsApp");
      launcher.focus({ preventScroll: true });
    }
    function togglePanel() {
      panel.hidden ? openPanel() : closePanel();
    }

    launcher.addEventListener("click", togglePanel);
    closeBtn.addEventListener("click", closePanel);

    // Suggested-query chips
    suggestions.addEventListener("click", (e) => {
      const chip = e.target.closest(".wa-chip");
      if (!chip) return;
      openWhatsApp(chip.textContent.trim());
    });

    // Typed message
    compose.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      openWhatsApp(text);
      input.value = "";
    });

    // Close on Escape when the panel is open
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !panel.hidden) closePanel();
    });
  })();

  /* --------------------------------------------------------------
     8. FOOTER YEAR (auto-updating)
  -------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
