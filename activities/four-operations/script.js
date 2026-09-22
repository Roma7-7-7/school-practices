/*
 * Four operations: +, -, x, /
 * Addition/subtraction walk through place-value decomposition of the second
 * number (e.g. 24 + 25 = 24 + 20 + 5 = 44 + 5 = 49); multiplication/division
 * are single-step fact-family checks. Only one operation panel is visible
 * at a time, switched via the tab buttons (MathFramework.setupTabs).
 */
(function () {
  const panels = {
    add: document.getElementById("panel-add"),
    sub: document.getElementById("panel-sub"),
    mul: document.getElementById("panel-mul"),
    div: document.getElementById("panel-div"),
  };
  const tabs = Array.from(document.querySelectorAll(".op-tab"));
  const feedbackEl = document.getElementById("feedback");
  const generateBtn = document.getElementById("generateBtn");
  const checkBtn = document.getElementById("checkBtn");

  let currentOp = "add";
  const problems = {};

  function generateAddition() {
    let a, b;
    do {
      a = MathFramework.randInt(10, 99);
      b = MathFramework.randInt(10, 99);
    } while (b % 10 === 0 || a + b > 99);

    const bTens = Math.floor(b / 10);
    const bOnes = b % 10;
    const afterTens = a + bTens * 10;
    const result = a + b;

    return {
      aTens: Math.floor(a / 10),
      aOnes: a % 10,
      bTens,
      bOnes,
      afterTensTens: Math.floor(afterTens / 10),
      afterTensOnes: afterTens % 10,
      resultTens: Math.floor(result / 10),
      resultOnes: result % 10,
    };
  }

  function generateSubtraction() {
    let a, b;
    do {
      a = MathFramework.randInt(10, 99);
      b = MathFramework.randInt(10, 99);
    } while (b % 10 === 0 || a <= b);

    const bTens = Math.floor(b / 10);
    const bOnes = b % 10;
    const afterTens = a - bTens * 10;
    const result = a - b;

    return {
      aTens: Math.floor(a / 10),
      aOnes: a % 10,
      bTens,
      bOnes,
      afterTensTens: Math.floor(afterTens / 10),
      afterTensOnes: afterTens % 10,
      resultTens: Math.floor(result / 10),
      resultOnes: result % 10,
    };
  }

  function generateMultiplication() {
    const x = MathFramework.randInt(1, 9);
    const y = MathFramework.randInt(1, 9);
    const result = x * y;
    return { x, y, resultTens: Math.floor(result / 10), resultOnes: result % 10 };
  }

  function generateDivision() {
    const divisor = MathFramework.randInt(1, 9);
    const quotient = MathFramework.randInt(1, 9);
    const dividend = divisor * quotient;
    return { divisor, quotient, dividend };
  }

  function renderAddition(panel, p) {
    MathFramework.setRole(panel, "add-a-tens", p.aTens);
    MathFramework.setRole(panel, "add-a-ones", p.aOnes);
    MathFramework.setRole(panel, "add-b-tens", p.bTens);
    MathFramework.setRole(panel, "add-b-ones", p.bOnes);
    MathFramework.setRole(panel, "add-a-tens-2", p.aTens);
    MathFramework.setRole(panel, "add-a-ones-2", p.aOnes);
  }

  function renderSubtraction(panel, p) {
    MathFramework.setRole(panel, "sub-a-tens", p.aTens);
    MathFramework.setRole(panel, "sub-a-ones", p.aOnes);
    MathFramework.setRole(panel, "sub-b-tens", p.bTens);
    MathFramework.setRole(panel, "sub-b-ones", p.bOnes);
    MathFramework.setRole(panel, "sub-a-tens-2", p.aTens);
    MathFramework.setRole(panel, "sub-a-ones-2", p.aOnes);
  }

  function renderMultiplication(panel, p) {
    MathFramework.setRole(panel, "mul-x", p.x);
    MathFramework.setRole(panel, "mul-y", p.y);
  }

  function renderDivision(panel, p) {
    MathFramework.setRole(panel, "div-dividend", p.dividend);
    MathFramework.setRole(panel, "div-divisor", p.divisor);
  }

  const OPS = {
    add: { generate: generateAddition, render: renderAddition },
    sub: { generate: generateSubtraction, render: renderSubtraction },
    mul: { generate: generateMultiplication, render: renderMultiplication },
    div: { generate: generateDivision, render: renderDivision },
  };

  function generateProblem(op) {
    const panel = panels[op];
    MathFramework.clearInputs(panel);
    const problem = OPS[op].generate();
    problems[op] = problem;
    OPS[op].render(panel, problem);

    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";

    const firstInput = panel.querySelector(".digit-input:not(.is-readonly)");
    if (firstInput) firstInput.focus();
  }

  function checkAnswer(op) {
    const panel = panels[op];
    const p = problems[op];
    const f = (name) => MathFramework.getField(panel, name);
    let fields;

    if (op === "add") {
      fields = [
        { el: f("add-decomp-tens"), expected: p.bTens },
        { el: f("add-decomp-ones"), expected: p.bOnes },
        { el: f("add-sum-tens"), expected: p.afterTensTens },
        { el: f("add-sum-ones"), expected: p.afterTensOnes },
        { el: f("add-ones-again"), expected: p.bOnes },
        { el: f("add-result-tens"), expected: p.resultTens },
        { el: f("add-result-ones"), expected: p.resultOnes },
      ];
    } else if (op === "sub") {
      fields = [
        { el: f("sub-decomp-tens"), expected: p.bTens },
        { el: f("sub-decomp-ones"), expected: p.bOnes },
        { el: f("sub-sum-tens"), expected: p.afterTensTens },
        { el: f("sub-sum-ones"), expected: p.afterTensOnes },
        { el: f("sub-ones-again"), expected: p.bOnes },
        { el: f("sub-result-tens"), expected: p.resultTens },
        { el: f("sub-result-ones"), expected: p.resultOnes },
      ];
    } else if (op === "mul") {
      fields = [
        { el: f("mul-result-tens"), expected: p.resultTens },
        { el: f("mul-result-ones"), expected: p.resultOnes },
      ];
    } else {
      fields = [{ el: f("div-quotient"), expected: p.quotient }];
    }

    const ok = MathFramework.validateFields(fields);
    MathFramework.setFeedback(
      feedbackEl,
      ok,
      ok ? "🎉 Чудово, все правильно! Спробуєш ще одну?" : "Десь є помилка — перевір червоні клітинки."
    );
  }

  const activateTab = MathFramework.setupTabs(tabs, panels, (op) => {
    currentOp = op;
    generateProblem(op);
  });

  generateBtn.addEventListener("click", () => generateProblem(currentOp));
  checkBtn.addEventListener("click", () => checkAnswer(currentOp));

  Object.values(panels).forEach((panel) => MathFramework.setupDigitInputs(panel));
  activateTab(currentOp);
})();
