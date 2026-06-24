/* CATaskKit site — small, dependency-free interactions. */
(function () {
  'use strict';

  // ── Sticky nav: add a backdrop once the page scrolls ──
  var nav = document.getElementById('nav');
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile menu toggle ──
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  function closeMenu() { document.body.classList.remove('menu-open'); }
  if (burger) {
    burger.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
  }
  if (menu) {
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }
  // Close the drawer if the viewport grows back to desktop.
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) closeMenu();
  });

  // ── Reveal-on-scroll ──
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // No IO support → just show everything.
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ── Smooth in-page anchor scrolling (respects fixed nav offset) ──
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── Current year in the footer ──
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ── Billing calculator ───────────────────────────────────────────────
  // Mirrors attendly/src/lib/billing.ts for a *new* workspace (fresh year, no
  // proration): annualTotal = rateFor(seats) × seats × 12, plus the optional
  // ₹5×seats×12 reimbursement add-on (free at ≤5 seats). Keep in sync with it.
  var empInput = document.getElementById('empInput');
  if (empInput) {
    var empRange = document.getElementById('empRange');
    var addonToggle = document.getElementById('addonToggle');

    var TIERS = [
      { upTo: 5,        rate: 0,  plan: 'Starter'  },
      { upTo: 10,       rate: 25, plan: 'Growth'   },
      { upTo: 50,       rate: 20, plan: 'Business' },
      { upTo: 100,      rate: 18, plan: 'Scale'    },
      { upTo: Infinity, rate: 15, plan: 'Scale'    }
    ];
    var FREE_LIMIT = 5;
    var REIMB_RATE = 5;
    function tierFor(s) { for (var i = 0; i < TIERS.length; i++) if (s <= TIERS[i].upTo) return TIERS[i]; return TIERS[TIERS.length - 1]; }
    function annualTotal(s) { return tierFor(s).rate * s * 12; }
    function addonAnnual(s) { return REIMB_RATE * s * 12; }

    var grp = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
    function inr(n) { return '₹' + grp.format(Math.round(n)); }
    function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

    var el = {
      plan: document.getElementById('calcPlan'),
      rate: document.getElementById('calcRate'),
      annual: document.getElementById('calcAnnual'),
      per: document.getElementById('calcPer'),
      lines: document.getElementById('calcLines'),
      note: document.getElementById('calcNote')
    };
    function row(label, val) { return '<div class="ln"><span>' + label + '</span><span>' + val + '</span></div>'; }

    function render() {
      var seats = clamp(Math.floor(Number(empInput.value) || 0), 1, 2000);
      var tier = tierFor(seats);
      var addonOn = addonToggle.checked;
      var seatYr = annualTotal(seats);
      var addonYr = (addonOn && seats > FREE_LIMIT) ? addonAnnual(seats) : 0;
      var total = seatYr + addonYr;
      var people = seats + (seats === 1 ? ' employee' : ' employees');

      el.plan.textContent = tier.plan + ' plan';

      var lines = '';
      if (seats <= FREE_LIMIT) {
        el.rate.textContent = 'Free for up to 5 employees';
        el.annual.textContent = inr(0);
        el.per.textContent = 'per year · free forever';
        lines += row(people, 'Free');
        lines += row('Reimbursements add-on', 'Included');
        el.note.textContent = 'No credit card required · renews free';
      } else {
        el.rate.textContent = inr(tier.rate) + ' / employee / month';
        el.annual.textContent = inr(total);
        el.per.textContent = 'per year · ' + inr(total / 12) + '/mo';
        lines += row(seats + ' × ' + inr(tier.rate) + ' × 12 mo', inr(seatYr));
        if (addonYr) lines += row('Reimbursements · ₹5 × ' + seats + ' × 12', inr(addonYr));
        lines += row('Per employee / month', addonYr ? inr(total / seats / 12) : inr(tier.rate));
        el.note.textContent = 'Billed annually · upgrades mid-year are prorated';
      }
      el.lines.innerHTML = lines;

      // Slider fill + value (slider tops out at its max; the number box can go higher).
      var rmax = Number(empRange.max);
      empRange.value = Math.min(seats, rmax);
      var fillPct = ((Math.min(seats, rmax) - 1) / (rmax - 1)) * 100;
      empRange.style.setProperty('--fill', fillPct + '%');
    }

    empInput.addEventListener('input', render);
    empInput.addEventListener('blur', function () {
      empInput.value = clamp(Math.floor(Number(empInput.value) || 0), 1, 2000);
      render();
    });
    empRange.addEventListener('input', function () { empInput.value = empRange.value; render(); });
    addonToggle.addEventListener('change', render);
    render();
  }
})();
