/* ── Future Mind Institute · Micro-interactions ── */

(function () {
  'use strict';

  /* 1. SCROLL-REVEAL ──────────────────────────────────────────
     Fade-up + slight slide for every section, card, and grid item.
     Uses IntersectionObserver — zero dependencies. */

  const revealEls = document.querySelectorAll(
    'section, .stat-item, .course-card, .service-card, .team-card, ' +
    '.feature-item, .process-step, .info-card, .partner-chip, .homeschool-banner'
  );

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger children within the same parent
    const siblings = el.parentElement
      ? Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal'))
      : [];
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${idx * 0.07}s`;
    revealObs.observe(el);
  });

  /* 2. TILT ON HOVER (cards) ──────────────────────────────────
     Subtle 3-D perspective shift when hovering course / service cards. */

  document.querySelectorAll('.course-card, .service-card, .team-card, .info-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* 3. STATS COUNTER ──────────────────────────────────────────
     Animate the 01-04 numbers counting up when they scroll in. */

  const statNums = document.querySelectorAll('.stat-num');
  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.textContent, 10);
        if (isNaN(target)) return;
        let current = 0;
        const step = () => {
          current++;
          el.textContent = String(current).padStart(2, '0');
          if (current < target) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterObs.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  statNums.forEach((n) => counterObs.observe(n));

  /* 4. NAV SHRINK ON SCROLL ──────────────────────────────────
     Slightly shrink the navbar after scrolling past the hero. */

  const nav = document.querySelector('nav');
  if (nav) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          nav.classList.toggle('nav-scrolled', window.scrollY > 80);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* 5. GRADIENT CURSOR FOLLOW (hero only) ─────────────────────
     A soft radial gradient follows the cursor inside the hero. */

  const hero = document.querySelector('.hero');
  if (hero) {
    const glow = document.createElement('div');
    glow.classList.add('hero-glow');
    hero.appendChild(glow);

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
  }

  /* 6. TYPING EFFECT (hero headline em) ──────────────────────
     Types the accented phrase letter by letter on load. */

  const heroEm = document.querySelector('.hero h1 em');
  if (heroEm) {
    const full = heroEm.textContent;
    heroEm.textContent = '';
    heroEm.style.borderRight = '2px solid var(--accent)';
    let i = 0;
    const type = () => {
      if (i < full.length) {
        heroEm.textContent += full[i];
        i++;
        setTimeout(type, 45);
      } else {
        // remove cursor after typing
        setTimeout(() => { heroEm.style.borderRight = 'none'; }, 600);
      }
    };
    setTimeout(type, 700); // delay so the fadeUp finishes first
  }

  /* 7. FLOATING DOTS BACKGROUND (for #why section) ───────────
     Draws a subtle animated dot grid via a small canvas. */

  const whySection = document.getElementById('why');
  if (whySection) {
    const canvas = document.createElement('canvas');
    canvas.classList.add('dot-canvas');
    whySection.style.position = 'relative';
    whySection.insertBefore(canvas, whySection.firstChild);

    const ctx = canvas.getContext('2d');
    let w, h, dots = [];

    function initDots() {
      w = canvas.width = whySection.offsetWidth;
      h = canvas.height = whySection.offsetHeight;
      dots = [];
      const count = Math.floor((w * h) / 18000);
      for (let j = 0; j < count; j++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2 + 1,
          dx: (Math.random() - 0.5) * 0.3,
          dy: (Math.random() - 0.5) * 0.3,
          o: Math.random() * 0.18 + 0.04,
        });
      }
    }

    function drawDots() {
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d) => {
        d.x += d.dx;
        d.y += d.dy;
        if (d.x < 0 || d.x > w) d.dx *= -1;
        if (d.y < 0 || d.y > h) d.dy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26,107,255,${d.o})`;
        ctx.fill();
      });
      requestAnimationFrame(drawDots);
    }

    initDots();
    drawDots();
    window.addEventListener('resize', initDots);
  }

  /* 8. PROGRESS BAR ──────────────────────────────────────────
     Thin accent-color progress bar at the very top of the page. */

  const bar = document.createElement('div');
  bar.classList.add('scroll-progress');
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.transform = `scaleX(${scrolled})`;
  });

  /* 9. MOBILE HAMBURGER MENU ──────────────────────────────────
     Creates a hamburger toggle for mobile nav. */

  const navLinks = document.querySelector('.nav-links');
  if (nav && navLinks) {
    const burger = document.createElement('button');
    burger.classList.add('nav-burger');
    burger.setAttribute('aria-label', 'Toggle menu');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);

    burger.addEventListener('click', () => {
      navLinks.classList.toggle('nav-open');
      burger.classList.toggle('burger-active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
        burger.classList.remove('burger-active');
      });
    });
  }
})();
