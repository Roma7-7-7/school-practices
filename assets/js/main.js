/*
 * Shared behavior for activity pages: the digit-box equation input pattern
 * (auto-advance, backspace-to-previous, digits-only), field validation +
 * feedback helpers, a random-int generator, data-attribute lookup helpers
 * for filling/reading equation slots, and a tab switcher for activities that
 * offer multiple modes (operations, levels, ...) on one page. Extracted from
 * the duplicated per-level logic in the legacy pages (math-1.html) so new
 * activities don't re-implement it — see activities/four-operations/script.js
 * for a worked example using every helper here.
 *
 * Usage from an activity's script.js:
 *   MathFramework.setupDigitInputs(document.getElementById('level1'));
 *   const ok = MathFramework.validateFields([
 *     { el: document.getElementById('tens2'), expected: String(problem.tens) },
 *     ...
 *   ]);
 *   MathFramework.setFeedback(feedbackEl, ok, ok ? 'Чудово!' : 'Спробуй ще раз.');
 */
window.MathFramework = (function () {
  function setupDigitInputs(container) {
    const inputs = Array.from(container.querySelectorAll(".digit-input:not(.is-readonly)"));

    inputs.forEach((input, index) => {
      input.addEventListener("focus", (e) => e.target.select());

      input.addEventListener("input", (e) => {
        if (e.target.value.length > 1) {
          e.target.value = e.target.value.slice(-1);
        }
        if (e.target.value && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && e.target.value === "" && index > 0) {
          const prev = inputs[index - 1];
          prev.focus();
          prev.value = "";
        }
      });

      input.addEventListener("keypress", (e) => {
        if (!/[0-9]/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
          e.preventDefault();
        }
      });
    });

    return inputs;
  }

  function clearInputs(container) {
    container.querySelectorAll(".digit-input:not(.is-readonly)").forEach((input) => {
      input.value = "";
      input.classList.remove("is-valid", "is-invalid");
    });
  }

  function validateFields(fields) {
    let allCorrect = true;
    fields.forEach(({ el, expected }) => {
      const value = el.value.trim();
      const correct = value === String(expected);
      el.classList.toggle("is-valid", correct);
      el.classList.toggle("is-invalid", !correct);
      if (!correct) allCorrect = false;
    });
    return allCorrect;
  }

  function setFeedback(el, success, message) {
    el.textContent = message;
    el.className = "feedback " + (success ? "feedback--success" : "feedback--error");
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Fills a [data-role] slot (a readonly .digit-input or a plain .operand
  // span) inside `container` with `value` — used for the given/derived
  // numbers of a generated problem.
  function setRole(container, role, value) {
    const el = container.querySelector(`[data-role="${role}"]`);
    if (!el) return;
    if (el.tagName === "INPUT") {
      el.value = value;
    } else {
      el.textContent = value;
    }
  }

  // Looks up an editable [data-field] input inside `container` — used to
  // build the field list passed to validateFields.
  function getField(container, name) {
    return container.querySelector(`[data-field="${name}"]`);
  }

  // Wires a set of .op-tab buttons to show/hide same-keyed panels and to
  // notify `onActivate(op)` on every switch (including the initial one, via
  // the returned activate() call). `panels` is a { op: element } map; each
  // tab's `data-op` must match a key.
  function setupTabs(tabButtons, panels, onActivate) {
    function activate(op) {
      tabButtons.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.op === op));
      Object.keys(panels).forEach((key) => panels[key].classList.toggle("is-hidden", key !== op));
      onActivate(op);
    }
    tabButtons.forEach((tab) => tab.addEventListener("click", () => activate(tab.dataset.op)));
    return activate;
  }

  return {
    setupDigitInputs,
    clearInputs,
    validateFields,
    setFeedback,
    randInt,
    setRole,
    getField,
    setupTabs,
  };
})();
