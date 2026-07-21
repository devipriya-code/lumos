// Mobile nav toggle
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
burger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks
  .querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open")),
  );

// Ticker content (signature element), duplicated for seamless loop
const tickerData = [
  ["CTR", "4.8%", "up"],
  ["ROAS", "6.2x", "up"],
  ["CAC", "−18%", "up"],
  ["Organic sessions", "+142%", "up"],
  ["Email opens", "38.4%", "up"],
  ["Bounce rate", "−9%", "up"],
  ["Conversion rate", "3.7%", "up"],
  ["Ad spend efficiency", "+27%", "up"],
  ["New leads / mo", "1,204", "up"],
];
const track = document.getElementById("tickerTrack");
function buildTicker() {
  let html = "";
  for (let rep = 0; rep < 2; rep++) {
    tickerData.forEach(([label, val]) => {
      html += `<div class="ticker-item">${label} <b>${val}</b> <span class="up">▲</span></div>`;
    });
  }
  track.innerHTML = html;
}
buildTicker();

// ---------- Hero content rotator ----------
// Cycles the eyebrow / headline / subtext through a few variants with a
// fade transition. Change ROTATE_INTERVAL_MS below to slow it down/speed
// it up (currently every 3 seconds).
const heroSlides = [
  {
    eyebrow: "Full-funnel digital marketing",
    headline:
      "Ideas don't spread<br>in the dark.<br>We light <em>the way.</em>",
    sub: "Lumos Media plans, runs, and reports on marketing that compounds — SEO, paid media, content, and lifecycle, all pointed at the same number: revenue.",
  },
  {
    eyebrow: "Paid media that pays back",
    headline: "Every rupee<br>should know<br>where it <em>landed.</em>",
    sub: "We plan, launch, and optimize paid campaigns against real cost-per-outcome data — not vanity clicks.",
  },
  {
    eyebrow: "Content that compounds",
    headline:
      "Rankings don't<br>happen by accident —<br>they're <em>built.</em>",
    sub: "Technical SEO, topic clusters, and editorial calendars designed to rank — and to actually get read.",
  },
];

const heroEyebrowEl = document.getElementById("heroEyebrow");
const heroHeadlineEl = document.getElementById("heroHeadline");
const heroSubEl = document.getElementById("heroSub");
const ROTATE_INTERVAL_MS = 3000;

if (heroEyebrowEl && heroHeadlineEl && heroSubEl) {
  let heroSlideIndex = 0;
  [heroEyebrowEl, heroHeadlineEl, heroSubEl].forEach((el) => {
    el.style.transition = "opacity .5s ease, transform .5s ease";
  });

  setInterval(() => {
    heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
    const next = heroSlides[heroSlideIndex];

    [heroEyebrowEl, heroHeadlineEl, heroSubEl].forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
    });

    setTimeout(() => {
      heroEyebrowEl.textContent = next.eyebrow;
      heroHeadlineEl.innerHTML = next.headline;
      heroSubEl.textContent = next.sub;
      [heroEyebrowEl, heroHeadlineEl, heroSubEl].forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    }, 500);
  }, ROTATE_INTERVAL_MS);
}

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
revealEls.forEach((el) => io.observe(el));

// Header shadow on scroll
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  header.style.boxShadow =
    window.scrollY > 10 ? "0 1px 12px rgba(34,211,238,0.08)" : "none";
});

// ---------- Contact form mailer ----------
// Uses FormSubmit (https://formsubmit.co) — a free form backend that emails
// submissions straight to your inbox, no server needed.
//
// SETUP (one-time):
// 1. Replace "your-email@example.com" below with the email you want
//    enquiries sent to.
// 2. Deploy/open the site and submit the form once yourself.
// 3. FormSubmit will email that address an "activation" link — click it.
//    Every submission after that lands straight in the inbox.
const MAILER_ENDPOINT =
  "https://formsubmit.co/ajax/c5cc77d6bd0f97a34f459e974e208d07";

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const submitBtn = document.getElementById("submitBtn");
  const statusEl = document.getElementById("formStatus");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // honeypot spam trap
    if (contactForm._honey && contactForm._honey.value) return;

    submitBtn.disabled = true;
    statusEl.style.color = "#7DD3FC";
    statusEl.textContent = "Sending...";

    try {
      const res = await fetch(MAILER_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      statusEl.style.color = "#22D3EE";
      statusEl.textContent =
        "Thanks — we'll be in touch within one business day.";
      contactForm.reset();
    } catch (err) {
      statusEl.style.color = "#f87171";
      statusEl.textContent =
        "Something went wrong sending that — please try again or email us directly.";
    } finally {
      submitBtn.disabled = false;
    }
  });
}
