const fs = require("fs");
const path = require("path");
const ts = require("typescript");

function loadTypeScriptModule(file) {
  const resolved = path.resolve(file);
  const source = fs.readFileSync(resolved, "utf8");
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
  calculateEngagementResult,
  calculateLeadershipStyleResult,
  engagementQuestions,
  leadershipStyleQuestions
} = loadTypeScriptModule("src/lib/side-assessments.ts");

function answersForTotal(count, minValue, maxValue, total) {
  const answers = {};
  let remaining = total - count * minValue;

  for (let id = 1; id <= count; id += 1) {
    const extra = Math.min(maxValue - minValue, remaining);
    answers[id] = minValue + extra;
    remaining -= extra;
  }

  if (remaining !== 0) throw new Error(`Cannot create answers for total ${total}`);
  return answers;
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, received ${actual}`);
  }
}

const engagementCases = [
  [22, "ยังไม่มีความผูกพันต่อองค์กร"],
  [49, "ยังไม่มีความผูกพันต่อองค์กร"],
  [50, "มีความผูกพันต่อองค์กรบ้าง"],
  [79, "มีความผูกพันต่อองค์กรบ้าง"],
  [80, "มีความผูกพันต่อองค์กรมาก"],
  [110, "มีความผูกพันต่อองค์กรมาก"]
];

for (const [score, expectedTitle] of engagementCases) {
  const result = calculateEngagementResult(
    answersForTotal(engagementQuestions.length, 1, 5, score)
  );
  assertEqual(result.score, score, `Engagement score ${score}`);
  assertEqual(result.title, expectedTitle, `Engagement band ${score}`);
}

const leadershipCases = [
  [8, "หัวหน้าสั่งลุย"],
  [12, "หัวหน้าสั่งลุย"],
  [13, "หัวหน้าแบบประชาธิปไตย"],
  [19, "หัวหน้าแบบประชาธิปไตย"],
  [20, "หัวหน้าแบบปล่อยให้ทำ"],
  [24, "หัวหน้าแบบปล่อยให้ทำ"]
];

for (const [score, expectedTitle] of leadershipCases) {
  const result = calculateLeadershipStyleResult(
    answersForTotal(leadershipStyleQuestions.length, 1, 3, score)
  );
  assertEqual(result.score, score, `Leadership score ${score}`);
  assertEqual(result.title, expectedTitle, `Leadership band ${score}`);
}

const mixedAnswers = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 3, 6: 3, 7: 3, 8: 3 };
const mixedResult = calculateLeadershipStyleResult(mixedAnswers);
assertEqual(mixedResult.score, 16, "Leadership mixed A/C score");
assertEqual(
  mixedResult.title,
  "หัวหน้าแบบประชาธิปไตย",
  "Leadership mixed A/C follows the supplied total-score key"
);
assertEqual(calculateEngagementResult({ 1: 5 }), null, "Incomplete Engagement answers");
assertEqual(
  calculateLeadershipStyleResult({ 1: 4, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 }),
  null,
  "Invalid Leadership answer"
);

console.log("Engagement thresholds: passed");
console.log("Leadership Style thresholds: passed");
console.log("Leadership mixed-answer scoring key: passed");
