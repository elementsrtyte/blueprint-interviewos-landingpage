(function () {
  "use strict";

  // ---- scale each fixed 1512x982 mockup down to fit its responsive frame ----
  function fitScreenFrames() {
    document.querySelectorAll("[data-screen-frame]").forEach(function (frame) {
      var inner = frame.querySelector("[data-screen-inner]");
      if (!inner) return;
      inner.style.transform = "scale(" + frame.clientWidth / 1512 + ")";
    });
  }
  fitScreenFrames();
  window.addEventListener("resize", fitScreenFrames);
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(fitScreenFrames);
    document.querySelectorAll("[data-screen-frame]").forEach(function (f) { ro.observe(f); });
  }
  // re-run once webfonts have swapped in, since that can shift layout widths
  setTimeout(fitScreenFrames, 400);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitScreenFrames);
  }

  // ---- mount the two fully-available Figma-exported screens ----
  document.querySelectorAll("[data-component]").forEach(function (mount) {
    var name = mount.getAttribute("data-component");
    var Component = window[name];
    if (Component && window.React && window.ReactDOM) {
      var root = ReactDOM.createRoot(mount);
      root.render(React.createElement(Component, { style: { width: 1512, height: 982 } }));
    } else {
      renderPlaceholder(mount, name);
    }
  });

  // ---- hand-built stand-in for TechnicalInterviewCodingAIToggle ----
  // The design MCP's file fetch caps at 256KB; this component's source was
  // truncated past that limit (see screens/Components.bundle.js). This is a
  // simplified placeholder — swap in the real pixel-perfect export when it's
  // available.
  function renderPlaceholder(mount, name) {
    if (name !== "TechnicalInterviewCodingAIToggle") return;
    mount.classList.add("screen-mount--placeholder");
    mount.innerHTML =
      '<div class="ph-toggle">' +
        '<div class="ph-toggle__pane ph-toggle__pane--code">' +
          '<div class="ph-toggle__bar">' +
            '<span class="ph-toggle__dot"></span><span class="ph-toggle__dot"></span><span class="ph-toggle__dot"></span>' +
            '<span class="ph-toggle__file">interview.ts</span>' +
          '</div>' +
          '<pre class="ph-toggle__code">function scoreCandidate(transcript) {\n  const evidence = extractQuotes(transcript);\n  return rubric.map(signal =&gt;\n    signal.score(evidence)\n  );\n}</pre>' +
        '</div>' +
        '<div class="ph-toggle__pane ph-toggle__pane--chat">' +
          '<div class="ph-toggle__bar"><span class="ph-toggle__file">AI assist &middot; prompt log</span></div>' +
          '<div class="ph-toggle__msg ph-toggle__msg--user">How should I paginate this without blocking the write path?</div>' +
          '<div class="ph-toggle__msg ph-toggle__msg--ai">Given 100:1 read/write, cursor-based pagination on the read replica.</div>' +
          '<div class="ph-toggle__msg ph-toggle__msg--user">Good &mdash; wire that into the existing repo layer.</div>' +
        '</div>' +
      '</div>';
  }
})();
