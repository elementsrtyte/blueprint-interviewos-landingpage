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
