const fs = require("fs");
const path = require("path");
const ts = require("typescript");

function loadTypeScriptModule(file) {
  const source = fs.readFileSync(path.resolve(file), "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020
    }
  }).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", code)(require, module, module.exports);
  return module.exports;
}

const {
  calculateLeadershipPotentialResult,
  leadershipPotentialQuestions,
  sanitizeLeadershipPotentialAnswers
} = loadTypeScriptModule("src/lib/leadership-potential.ts");

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, received ${actual}`);
  }
}

const allA = Object.fromEntries(leadershipPotentialQuestions.map((question) => [question.id, "A"]));
const allAResult = calculateLeadershipPotentialResult(allA);
assertEqual(allAResult.counts.A, 10, "All A answers are counted");
assertEqual(allAResult.leaders[0].code, "A", "A wins when selected most");
assertEqual(allAResult.hasTie, false, "A clear winner is not a tie");

const tieAnswers = Object.fromEntries(
  leadershipPotentialQuestions.map((question, index) => [question.id, index < 5 ? "A" : "B"])
);
const tieResult = calculateLeadershipPotentialResult(tieAnswers);
assertEqual(tieResult.leaders.length, 2, "Every tied leader is returned");
assertEqual(tieResult.hasTie, true, "A tied maximum is flagged");

assertEqual(calculateLeadershipPotentialResult({ 1: "A" }), null, "Incomplete answers are rejected");
const sanitized = sanitizeLeadershipPotentialAnswers({ 1: "A", 2: "Z", 11: "B", 3: 4 });
assertEqual(sanitized[1], "A", "Valid stored answer is preserved");
assertEqual(sanitized[2], undefined, "Unknown answer code is removed");
assertEqual(sanitized[11], undefined, "Unknown question is removed");

console.log("Leadership Potential majority scoring: passed");
console.log("Leadership Potential tie handling: passed");
console.log("Leadership Potential state validation: passed");
