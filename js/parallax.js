/* Custom GSAP scroll motion for the meenaya-2 clone.
   Every decorative / feature image drifts as you scroll (depth parallax).
   A throttled scan attaches parallax to each element once it has real dimensions
   (Framer lazy-loads images as they near the viewport). Tiny icons/logos are
   skipped. Respects prefers-reduced-motion. */
(function () {
  "use strict";

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Stable, varied per-element speed (lively, not lockstep) — same on every reload.
  function rand(seed) {
    var x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  var attached = new WeakSet();
  var counter = 0;
  var hero = null;
  var refreshTimer = null;
  var ticking = false;

  function qualifies(el) {
    var r = el.getBoundingClientRect();
    if (r.width < 70 || r.height < 70) return false;   // icons / logos / avatars
    if (r.width * r.height < 6000) return false;        // slivers
    return true;
  }

  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () { ScrollTrigger.refresh(); }, 250);
  }

  function attach(el) {
    if (attached.has(el) || !qualifies(el)) return;
    attached.add(el);
    el.style.willChange = "transform";

    if (el === hero) {
      gsap.set(el, { scale: 1.12, transformOrigin: "50% 50%", force3D: true });
      gsap.to(el, {
        yPercent: 10, ease: "none",
        scrollTrigger: { trigger: hero.closest("div") || hero, start: "top top", end: "bottom top", scrub: true }
      });
      scheduleRefresh();
      return;
    }

    var i = ++counter;
    var area = el.getBoundingClientRect().width * el.getBoundingClientRect().height;
    var base = area > 90000 ? 6 : (area > 16000 ? 10 : 14);   // small bits drift a touch more
    var amt = base + rand(i + 1) * 6;
    var dir = rand(i + 7) > 0.5 ? 1 : -1;                      // mix up/down for depth
    var yp = amt * dir;

    gsap.fromTo(el, { yPercent: -yp }, {
      yPercent: yp, ease: "none", force3D: true,
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 + rand(i + 3) * 0.6 }
    });
    scheduleRefresh();
  }

  function allElements() {
    var els = Array.prototype.slice.call(document.images);
    Array.prototype.slice.call(document.querySelectorAll("svg")).forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.width >= 90 && r.height >= 90) els.push(s);
    });
    return els;
  }

  // Attach any element that now qualifies and sits within ~2 viewports of the
  // current scroll position (by then Framer has loaded it and it has real size).
  function scan() {
    ticking = false;
    var vh = window.innerHeight || 800;
    var top = window.scrollY, bottom = top + vh;
    allElements().forEach(function (el) {
      if (attached.has(el)) return;
      var r = el.getBoundingClientRect();
      var elTop = r.top + window.scrollY, elBottom = elTop + r.height;
      if (elBottom > top - vh && elTop < bottom + vh) attach(el);
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(scan);
  }

  function setup() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero = largest measurable element in the first viewport.
    var vh = window.innerHeight || 800, heroArea = 0;
    allElements().forEach(function (el) {
      var r = el.getBoundingClientRect();
      if ((r.top + window.scrollY) < vh * 0.9 && r.width * r.height > heroArea) {
        heroArea = r.width * r.height; hero = el;
      }
    });

    scan();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { scheduleRefresh(); onScroll(); });
    window.addEventListener("load", function () { scheduleRefresh(); onScroll(); });
    // Framer keeps below-fold images at zero size until they're scrolled near, and
    // they're already "complete" so no load event refires. A light periodic scan is
    // the reliable signal to wire them up as they gain real dimensions; it skips
    // already-attached elements (WeakSet) so each pass is cheap.
    setInterval(scan, 400);
  }

  function ready() {
    if (document.readyState === "complete") setTimeout(setup, 600);
    else window.addEventListener("load", function () { setTimeout(setup, 600); });
  }
  ready();
})();
