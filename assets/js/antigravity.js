/**
 * toggle-drag.js (assets/js/antigravity.js)
 * Clean, Toggle-Controlled Drag and Drop Engine
 *
 * Rules:
 *  1. Default: Completely stationary. NO automatic animations or floating.
 *  2. Toggle Button: Mode is OFF by default. Clicking toggles ON/OFF.
 *  3. Drag: ONLY works when mode is ON. Only the single clicked element moves.
 *  4. Drop: Element stays in new dropped position until toggled OFF or reset.
 *  5. Clean Pointer Events: Works smoothly on both Desktop (mouse) and Mobile (touch).
 */

(function () {
  "use strict";

  let isDragMode = false;
  let cardControllers = [];

  document.addEventListener("DOMContentLoaded", initDragToggleFeature);

  function initDragToggleFeature() {
    setupToggleButton();
    setupDraggableElements();
  }

  /* =========================================================================
     1. Setup The Toggle Button
     ========================================================================= */
  function setupToggleButton() {
    let btn = document.getElementById("dragToggleBtn");

    // Auto-create button if not present in HTML markup
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "dragToggleBtn";
      btn.className = "drag-toggle-btn";
      btn.type = "button";
      btn.setAttribute("aria-label", "Toggle Free Drag Mode");
      btn.innerHTML = `
        <i class="bi bi-arrows-move"></i>
        <span class="btn-text">Enable Free Drag</span>
      `;
      document.body.appendChild(btn);
    }

    const btnText = btn.querySelector(".btn-text") || btn;

    btn.addEventListener("click", () => {
      isDragMode = !isDragMode;

      if (isDragMode) {
        // Mode Turned ON
        btn.classList.add("active");
        btnText.textContent = "Disable Free Drag";
        document.body.classList.add("drag-mode-active");
      } else {
        // Mode Turned OFF
        btn.classList.remove("active");
        btnText.textContent = "Enable Free Drag";
        document.body.classList.remove("drag-mode-active");

        // Smoothly return all moved elements back to their clean grid positions
        resetAllElementPositions();
      }
    });
  }

  /* =========================================================================
     2. Setup Draggable Elements (Card-by-Card Isolation)
     ========================================================================= */
  function setupDraggableElements() {
    const targets = document.querySelectorAll(
      ".portfolio-card, .skill-pill-3d, .service-item, .info-item"
    );

    cardControllers = [];

    targets.forEach((el) => {
      let posX = 0;
      let posY = 0;
      let startX = 0;
      let startY = 0;

      let isPointerDown = false;
      let hasMoved = false;
      let activePointerId = null;

      // Reset controller for this specific element
      const reset = () => {
        if (posX === 0 && posY === 0) return;
        el.classList.add("is-resetting");
        el.style.transform = "translate3d(0px, 0px, 0px)";
        setTimeout(() => {
          el.classList.remove("is-resetting");
          el.style.transform = "";
          posX = 0;
          posY = 0;
        }, 500);
      };

      cardControllers.push({ element: el, reset });

      // Pointer Down
      el.addEventListener("pointerdown", (e) => {
        // Strictly obey Toggle Button: do nothing if mode is OFF
        if (!isDragMode) return;
        if (e.button !== 0) return; // Left mouse button or single touch only

        isPointerDown = true;
        hasMoved = false;
        activePointerId = e.pointerId;

        startX = e.clientX;
        startY = e.clientY;

        // Capture pointer so fast drag gestures never drop
        try {
          el.setPointerCapture(e.pointerId);
        } catch (err) {}

        el.classList.remove("is-resetting");
      });

      // Pointer Move
      el.addEventListener("pointermove", (e) => {
        if (!isDragMode || !isPointerDown || e.pointerId !== activePointerId) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Distinguish intentional drag from a static click
        if (!hasMoved && Math.hypot(deltaX, deltaY) > 3) {
          hasMoved = true;
          el.classList.add("is-dragging");
        }

        if (hasMoved) {
          e.preventDefault(); // Prevent touch-screen scrolling while dragging this card
          const currentX = posX + deltaX;
          const currentY = posY + deltaY;
          el.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 35px)`;
        }
      });

      // Pointer Up / Cancel
      const onPointerEnd = (e) => {
        if (!isPointerDown || e.pointerId !== activePointerId) return;

        if (hasMoved) {
          posX += e.clientX - startX;
          posY += e.clientY - startY;
        }

        isPointerDown = false;
        activePointerId = null;

        try {
          el.releasePointerCapture(e.pointerId);
        } catch (err) {}

        el.classList.remove("is-dragging");
      };

      el.addEventListener("pointerup", onPointerEnd);
      el.addEventListener("pointercancel", onPointerEnd);

      // Prevent child link navigation if the user was dragging
      el.addEventListener(
        "click",
        (e) => {
          if (hasMoved) {
            e.preventDefault();
            e.stopImmediatePropagation();
            hasMoved = false;
          }
        },
        true // Intercept during capture phase before <a> tags fire
      );
    });
  }

  function resetAllElementPositions() {
    cardControllers.forEach((ctrl) => {
      ctrl.reset();
    });
  }
})();
