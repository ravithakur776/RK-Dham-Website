/* =========================================================
   RK DHAM RESIDENCY — Interactions & Animation
   ========================================================= */

document.getElementById("year").textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* ---------------- Lenis smooth scroll ---------------- */
let lenis;
if (!prefersReducedMotion && window.Lenis) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  lenis.on("scroll", () => {
    if (window.ScrollTrigger) ScrollTrigger.update();
  });
}

/* ---------------- GSAP setup ---------------- */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    if (lenis) lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/* ---------------- Custom cursor ---------------- */
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");
if (cursorDot && window.matchMedia("(min-width: 901px)").matches) {
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.left = mx + "px";
    cursorDot.style.top = my + "px";
  });
  function ringLoop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    cursorRing.style.left = rx + "px";
    cursorRing.style.top = ry + "px";
    requestAnimationFrame(ringLoop);
  }
  ringLoop();
  document
    .querySelectorAll("a, button, .masonry-item, .faq-q")
    .forEach((el) => {
      el.addEventListener("mouseenter", () =>
        cursorRing.classList.add("hover"),
      );
      el.addEventListener("mouseleave", () =>
        cursorRing.classList.remove("hover"),
      );
    });
}

/* ---------------- Magnetic buttons ---------------- */
document.querySelectorAll(".magnetic").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.4, duration: 0.4, ease: "power3.out" });
  });
  btn.addEventListener("mouseleave", () =>
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" }),
  );
});

/* ---------------- Header scroll state ---------------- */
const header = document.getElementById("siteHeader");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 60);
});

/* ---------------- Mobile nav ---------------- */
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("open");
  mobileNav.classList.toggle("open");
});
mobileNav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menuToggle.classList.remove("open");
    mobileNav.classList.remove("open");
  }),
);

/* ---------------- Hero text reveal ---------------- */
if (window.gsap) {
  const tl = gsap.timeline({ delay: 0.3 });
  tl.to(
    ".hero-title .word",
    { y: 0, duration: 1, ease: "power4.out", stagger: 0.04 },
    0,
  )
    .fromTo(
      ".hero-title .word",
      { yPercent: 120 },
      { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.04 },
      0,
    )
    .fromTo(
      ".eyebrow.reveal-line span",
      { yPercent: 120 },
      { yPercent: 0, duration: 0.8, ease: "power3.out" },
      0.2,
    )
    .fromTo(
      ".hero-sub span",
      { yPercent: 120 },
      { yPercent: 0, duration: 0.8, ease: "power3.out" },
      0.35,
    )
    .fromTo(
      ".hero-actions",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.55,
    )
    .fromTo(
      ".hero-price",
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.7,
    );
}

/* ---------------- Scroll reveals ---------------- */
if (window.gsap && window.ScrollTrigger) {
  gsap.utils.toArray(".reveal-up").forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      delay: (i % 3) * 0.06,
    });
  });
  gsap.utils.toArray(".reveal-img").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  });

  /* Room / testimonial / why cards stagger already covered by reveal-up per-item */
}

/* ---------------- Garland scroll progress (signature element) ---------------- */
const garlandThread = document.getElementById("garlandThread");
const beads = document.querySelectorAll(".garland-bead");
const sections = Array.from(beads).map((b) =>
  document.querySelector(b.dataset.target),
);

function updateGarland() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = Math.min(100, (scrollTop / docHeight) * 100);
  garlandThread.style.height = pct + "%";

  let activeIndex = 0;
  sections.forEach((sec, i) => {
    if (sec && sec.getBoundingClientRect().top < window.innerHeight * 0.5)
      activeIndex = i;
  });
  beads.forEach((b, i) => b.classList.toggle("active", i <= activeIndex));
}
window.addEventListener("scroll", updateGarland);
updateGarland();

beads.forEach((bead) => {
  bead.addEventListener("click", () => {
    const target = document.querySelector(bead.dataset.target);
    if (target) {
      if (lenis) lenis.scrollTo(target, { duration: 1.2 });
      else target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* Smooth-scroll for in-page nav links */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { duration: 1.2 });
        else target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

/* ---------------- Gallery lightbox ---------------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
document.querySelectorAll(".masonry-item").forEach((item) => {
  item.addEventListener("click", () => {
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector("img").alt;
    lightbox.classList.add("open");
  });
});
document
  .getElementById("lightboxClose")
  .addEventListener("click", () => lightbox.classList.remove("open"));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.classList.remove("open");
});

/* ---------------- FAQ accordion ---------------- */
document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  q.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((i) => {
      i.classList.remove("open");
      i.querySelector(".faq-a").style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add("open");
      a.style.maxHeight = a.scrollHeight + "px";
    }
  });
});

/* ---------------- Nearby track: mouse-wheel drag scroll ---------------- */
const nearbyTrack = document.getElementById("nearbyTrack");
if (nearbyTrack) {
  let isDown = false,
    startX,
    scrollLeft;
  const wrap = nearbyTrack.parentElement;
  wrap.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
  });
  wrap.addEventListener("mouseleave", () => (isDown = false));
  wrap.addEventListener("mouseup", () => (isDown = false));
  wrap.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    wrap.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

/* ---------------- Booking form -> WhatsApp ---------------- */
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  // Set minimum date to today for check-in and check-out
  const today = new Date().toISOString().split("T")[0];
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  if (checkinInput && checkoutInput) {
    checkinInput.min = today;
    checkoutInput.min = today;

    checkinInput.addEventListener("change", () => {
      if (checkinInput.value) {
        checkoutInput.min = checkinInput.value;
        if (checkoutInput.value && checkoutInput.value < checkinInput.value) {
          checkoutInput.value = checkinInput.value;
        }
      }
    });
  }

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const guests = document.getElementById("guests").value;
    const message = document.getElementById("message").value.trim();

    if (checkout && checkin && checkout < checkin) {
      alert("Check-out date cannot be before check-in date.");
      return;
    }

    const rawText = `Namaste! I'd like to book a room at RK Dham Residency.\n\nName: ${name}\nPhone: ${phone}\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nGuests: ${guests}\nMessage: ${message || "—"}`;

    window.open(`https://wa.me/919990123888?text=${encodeURIComponent(rawText)}`, "_blank", "noopener,noreferrer");
  });
}

