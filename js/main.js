(function () {
  "use strict";

  var modal = document.getElementById("demo-modal");
  if (!modal) return;

  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var closeBtn = modal.querySelector("[data-close-demo-modal]");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  document.querySelectorAll("[data-open-demo-modal]").forEach(function (btn) {
    btn.addEventListener("click", openModal);
  });
  modal.querySelectorAll("[data-close-demo-modal]").forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  // Purely decorative — populates the current month so the placeholder reads
  // as a real calendar. No dates are clickable; nothing is actually booked.
  var monthEl = modal.querySelector("[data-cal-month]");
  var gridEl = modal.querySelector("[data-cal-grid]");
  if (monthEl && gridEl) {
    var now = new Date();
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    monthEl.textContent = monthNames[now.getMonth()] + " " + now.getFullYear();

    ["S", "M", "T", "W", "T", "F", "S"].forEach(function (d) {
      var el = document.createElement("span");
      el.className = "mock-cal__weekday";
      el.textContent = d;
      gridEl.appendChild(el);
    });

    var firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    var daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    for (var i = 0; i < firstDay; i++) {
      gridEl.appendChild(document.createElement("span"));
    }
    for (var day = 1; day <= daysInMonth; day++) {
      var cell = document.createElement("span");
      cell.className = "mock-cal__day";
      cell.textContent = String(day);
      if (day === now.getDate()) cell.classList.add("mock-cal__day--today");
      if (day > now.getDate() && day % 4 === 0) cell.classList.add("mock-cal__day--available");
      gridEl.appendChild(cell);
    }
  }
})();

(function () {
  "use strict";

  var prefersReducedMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var hasFinePointer = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);

  // ============ BACKGROUND GRID GLOW ============
  if (!prefersReducedMotion && hasFinePointer) {
    var bgGrid = document.querySelector(".bg-grid");
    if (bgGrid) {
      var targetX = 0;
      var targetY = 0;
      var currentX = 0;
      var currentY = 0;
      var hasStarted = false;
      var rafId = null;
      var easing = 0.12;

      function loop() {
        currentX += (targetX - currentX) * easing;
        currentY += (targetY - currentY) * easing;
        bgGrid.style.setProperty("--mx", currentX.toFixed(1) + "px");
        bgGrid.style.setProperty("--my", currentY.toFixed(1) + "px");
        if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
          rafId = window.requestAnimationFrame(loop);
        } else {
          rafId = null;
        }
      }

      window.addEventListener("mousemove", function (e) {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!hasStarted) {
          currentX = targetX;
          currentY = targetY;
          hasStarted = true;
        }
        bgGrid.classList.add("is-active");
        if (rafId === null) {
          rafId = window.requestAnimationFrame(loop);
        }
      }, { passive: true });

      document.addEventListener("mouseleave", function () {
        bgGrid.classList.remove("is-active");
      });
    }
  }

  // ============ SIGNAL CARD CURSOR SPOTLIGHT ============
  if (!prefersReducedMotion && hasFinePointer) {
    document.querySelectorAll(".signal-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", (e.clientX - rect.left) + "px");
        card.style.setProperty("--spot-y", (e.clientY - rect.top) + "px");
      });
    });
  }

  // ============ NAV SCROLL ELEVATION ============
  (function () {
    var nav = document.querySelector(".nav");
    if (!nav) return;

    var ticking = false;
    function update() {
      nav.classList.toggle("nav--scrolled", window.scrollY > 40);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  })();
})();
