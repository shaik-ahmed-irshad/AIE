/**
 * Ahmed's Institute of Excellence
 * Lightweight vanilla JS — replaces ~600KB of jQuery + plugins
 */

(function () {
  'use strict';

  // ===== Navbar scroll effect =====
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('navbar-scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ===== Mobile nav toggle =====
  const menuBtn = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const closeBtn = document.getElementById('close-nav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => mobileNav.classList.add('open'));
    if (closeBtn) {
      closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
    }
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) mobileNav.classList.remove('open');
    });
  }

  // ===== Animated counter =====
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    }

    requestAnimationFrame(update);
  }

  // ===== Scroll reveal with Intersection Observer =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counters inside revealed elements
        entry.target.querySelectorAll('[data-target]').forEach(counter => {
          if (!counter.dataset.animated) {
            counter.dataset.animated = 'true';
            animateCounter(counter);
          }
        });

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Observe all reveal variants
  document.querySelectorAll('.reveal, .reveal-stagger, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // ===== Testimonial carousel auto-scroll =====
  const track = document.querySelector('.testimonial-track');
  if (track) {
    let scrollInterval;
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 10) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }, 4000);
    };

    startAutoScroll();
    track.addEventListener('mouseenter', () => clearInterval(scrollInterval));
    track.addEventListener('mouseleave', startAutoScroll);
    track.addEventListener('touchstart', () => clearInterval(scrollInterval), { passive: true });
    track.addEventListener('touchend', () => {
      clearInterval(scrollInterval);
      setTimeout(startAutoScroll, 3000);
    });
  }

  // ===== Countdown timer =====
  function startCountdown() {
    const targetDate = new Date('2026-03-01T09:00:00+05:30').getTime();
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minsEl = document.getElementById('countdown-mins');

    if (!daysEl || !hoursEl || !minsEl) return;

    function tick() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        daysEl.textContent = '0';
        hoursEl.textContent = '0';
        minsEl.textContent = '0';
        return;
      }

      daysEl.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
      hoursEl.textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minsEl.textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    }

    tick();
    setInterval(tick, 60000);
  }
  startCountdown();

  // ===== FAQ accordion (smooth CSS-driven) =====
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isOpen = answer.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

      // Toggle current
      if (!isOpen) {
        answer.classList.add('open');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });

})();
