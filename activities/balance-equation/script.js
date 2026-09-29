/*
 * Balance equation: "A ○ B = C ○ D" with exactly one of the four numbers
 * hidden (1 or 2 digits). The learner types the missing number. All numbers
 * stay in 1..99 (sums and minuends too); × and ÷ stay within the 9×9 table
 * (factors, divisors and quotients 2..9). All operations are exact integer ones,
 * so the answer is unique.
 */
(function () {
  const MAX = 99;
  const SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷" };
  const OPS = Object.keys(SYMBOLS);

  const equationEl = document.getElementById("equation");
  const feedbackEl = document.getElementById("feedback");
  const generateBtn = document.getElementById("generateBtn");
  const checkBtn = document.getElementById("checkBtn");

  let problem = null;

  function apply(a, op, b) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    return a / b;
  }

  // Random operands (a, b) for `op` such that the result is a whole number in 1..MAX.
  function randomExpression(op) {
    const r = MathFramework.randInt;
    let a, b;
    if (op === "+") {
      a = r(1, MAX - 1);
      b = r(1, MAX - a);
    } else if (op === "-") {
      a = r(2, MAX);
      b = r(1, a - 1);
    } else if (op === "*") {
      a = r(2, 9);
      b = r(2, 9);
    } else {
      b = r(2, 9);
      a = b * r(2, 9);
    }
    return { a, b, value: apply(a, op, b) };
  }

  // Given the target value V and the op, pick (c, d) with c op d = V, or null.
  function matchingExpression(op, value) {
    const r = MathFramework.randInt;
    let c, d;
    if (op === "+") {
      if (value < 2) return null;
      d = r(1, value - 1);
      c = value - d;
    } else if (op === "-") {
      if (value >= MAX) return null;
      d = r(1, MAX - value);
      c = value + d;
    } else if (op === "*") {
      const divisors = [];
      for (let i = 2; i <= 9; i++) if (value % i === 0 && value / i >= 2 && value / i <= 9) divisors.push(i);
      if (!divisors.length) return null;
      d = divisors[r(0, divisors.length - 1)];
      c = value / d;
    } else {
      if (value < 2 || value > 9) return null;
      d = r(2, 9);
      c = value * d;
    }
    if (c < 1 || d < 1 || c > MAX || d > MAX) return null;
    return { c, d };
  }

  function generateProblem() {
    for (;;) {
      const opL = OPS[MathFramework.randInt(0, 3)];
      const opR = OPS[MathFramework.randInt(0, 3)];
      const left = randomExpression(opL);
      const right = matchingExpression(opR, left.value);
      if (!right) continue;
      const numbers = [left.a, left.b, right.c, right.d];
      // Skip the trivial "same expression on both sides" case.
      if (opL === opR && left.a === right.c && left.b === right.d) continue;
      return { numbers, opL, opR, blank: MathFramework.randInt(0, 3) };
    }
  }

  function render(p) {
    MathFramework.setRole(equationEl, "op-left", SYMBOLS[p.opL]);
    MathFramework.setRole(equationEl, "op-right", SYMBOLS[p.opR]);

    p.numbers.forEach((n, i) => {
      const slot = equationEl.querySelector(`[data-slot="${i}"]`);
      slot.innerHTML = "";
      if (i !== p.blank) {
        const span = document.createElement("span");
        span.className = "operand";
        span.textContent = n;
        slot.appendChild(span);
        return;
      }
      String(n).split("").forEach((_, k) => {
        const input = document.createElement("input");
        input.className = "digit-input";
        input.type = "text";
        input.inputMode = "numeric";
        input.maxLength = 1;
        input.dataset.field = "blank-" + k;
        slot.appendChild(input);
      });
      MathFramework.setupDigitInputs(slot);
    });
  }

  function newProblem() {
    problem = generateProblem();
    render(problem);
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";
    const first = equationEl.querySelector(".digit-input");
    if (first) first.focus();
  }

  function checkAnswer() {
    const digits = String(problem.numbers[problem.blank]).split("");
    const fields = digits.map((digit, k) => ({
      el: MathFramework.getField(equationEl, "blank-" + k),
      expected: digit,
    }));
    const ok = MathFramework.validateFields(fields);
    MathFramework.setFeedback(
      feedbackEl,
      ok,
      ok ? "🎉 Чудово, все правильно! Спробуєш ще одну?" : "Ще не зовсім — перевір число й спробуй ще раз."
    );
  }

  MathFramework.setupStopwatch(document.getElementById("stopwatch"));

  generateBtn.addEventListener("click", newProblem);
  checkBtn.addEventListener("click", checkAnswer);
  newProblem();
})();
