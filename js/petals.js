/* Falling rose petals — spawns a handful of petal images that drift down slowly
   like a soft rain, each with its own speed, sway, size, rotation and opacity.
   Uses /images/petal.png. Pairs with css/petals.css. */
(function () {
  "use strict";

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var COUNT = 26;                 // calm, not a snowstorm
  var SRC = "/images/petal.png";

  function rnd(min, max) { return min + Math.random() * (max - min); }

  function makePetal(layer) {
    var size = rnd(16, 34);                 // px

    var petal = document.createElement("div");
    petal.className = "petal";
    petal.style.left = rnd(0, 100) + "vw";
    petal.style.width = size + "px";
    petal.style.height = size + "px";
    petal.style.opacity = rnd(0.45, 0.9).toFixed(2);

    // Slow fall: 12–24s. Negative delay so petals are already mid-air on load.
    var fall = rnd(12, 24);
    petal.style.animationDuration = fall + "s";
    petal.style.animationDelay = (-rnd(0, fall)) + "s";

    // Sway + tumble on the inner node so it doesn't fight the vertical fall.
    var inner = document.createElement("i");
    var drift = rnd(20, 75);
    inner.style.setProperty("--drift", drift + "px");
    inner.style.setProperty("--r0", rnd(-30, 30) + "deg");
    inner.style.setProperty("--r1", rnd(180, 420) + "deg");
    inner.style.animationDuration = rnd(3.5, 7) + "s";
    inner.style.animationDelay = (-rnd(0, 5)) + "s";

    var img = document.createElement("img");
    img.src = SRC;
    img.alt = "";
    img.decoding = "async";
    img.draggable = false;

    inner.appendChild(img);
    petal.appendChild(inner);
    layer.appendChild(petal);
  }

  function start() {
    if (document.getElementById("petal-rain")) return;
    var layer = document.createElement("div");
    layer.id = "petal-rain";
    document.body.appendChild(layer);
    for (var i = 0; i < COUNT; i++) makePetal(layer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
