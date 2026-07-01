/* Places the temple gopuram (a transparent cutout of the hero mural) in FRONT of
   the large "Arun & Aswathy" invite names, so the names read as sitting behind the
   temple. The invite block is identified by its big "&" (the top hero uses "weds",
   so this won't match there). Body-level overlay, re-measured on a light interval
   because Framer lays the block out only once it's scrolled near. */
(function () {
  "use strict";

  var SRC = "/framerusercontent.com/images/temple-cutout.png";
  var ASPECT = 315 / 390;               // cutout width / height

  function inviteBlock() {
    // biggest standalone "&" = the invite couple-names separator
    var amp = [].slice.call(document.querySelectorAll("*"))
      .filter(function (e) { return e.children.length === 0 && (e.textContent || "").trim() === "&"; })
      .sort(function (a, b) { return (parseFloat(getComputedStyle(b).fontSize) || 0) - (parseFloat(getComputedStyle(a).fontSize) || 0); })[0];
    if (!amp) return null;
    var n = amp;
    for (var i = 0; i < 6 && n.parentElement; i++) {
      n = n.parentElement;
      var t = (n.textContent || "").replace(/\s+/g, " ");
      if (/Arun/.test(t) && /Aswathy/.test(t)) return n;
    }
    return null;
  }

  function build() {
    if (document.getElementById("temple-front")) return;
    var img = document.createElement("img");
    img.id = "temple-front";
    img.src = SRC;
    img.alt = "";
    img.decoding = "async";
    img.draggable = false;
    document.body.appendChild(img);
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, { passive: true });
    setInterval(position, 400);          // reliable against lazy layout / dropped scroll events
  }

  function position() {
    var img = document.getElementById("temple-front");
    if (!img) return;
    var blk = inviteBlock();
    if (!blk) { img.style.display = "none"; return; }
    var r = blk.getBoundingClientRect();
    if (r.height < 80) { img.style.display = "none"; return; }  // not laid out yet

    var top = r.top + window.scrollY;
    var h = r.height;
    var cx = r.left + r.width / 2;

    var th = h * 0.8;                     // temple height ~ 80% of the names block
    var tw = th * ASPECT;
    img.style.display = "block";
    img.style.width = Math.round(tw) + "px";
    img.style.height = Math.round(th) + "px";
    img.style.left = Math.round(cx - tw / 2) + "px";
    img.style.top = Math.round(top - th * 0.30) + "px";   // rises above, base overlaps upper names
  }

  if (document.readyState === "complete") setTimeout(build, 700);
  else window.addEventListener("load", function () { setTimeout(build, 700); });
})();
