/*
 * Shared behavior for activity pages: the digit-box equation input pattern
 * (auto-advance, backspace-to-previous, digits-only) and simple field
 * validation + feedback helpers. Extracted from the duplicated per-level
 * logic in the legacy pages (math-1.html) so new activities don't re-implement it.
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

  return { setupDigitInputs, clearInputs, validateFields, setFeedback };
})();
