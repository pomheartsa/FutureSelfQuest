const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const moduleCache = new Map();

function loadTypeScriptModule(file) {
  const resolved = path.resolve(file);
  const cached = moduleCache.get(resolved);
  if (cached) return cached.exports;

  const module = { exports: {} };
  moduleCache.set(resolved, module);

  const source = fs.readFileSync(resolved, "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020
    }
  }).outputText;

  const localRequire = (request) => {
    if (request.startsWith(".")) {
      return loadTypeScriptModule(path.resolve(path.dirname(resolved), `${request}.ts`));
    }
    return require(request);
  };

  new Function("require", "module", "exports", code)(localRequire, module, module.exports);
  return module.exports;
}

const { questions } = loadTypeScriptModule("src/lib/assessment.ts");
const { calculateProfile } = loadTypeScriptModule("src/lib/scoring.ts");

const careerProfiles = {
  Swordman: ["managingSelf", "selfManagement", "conscientiousness"],
  Merchant: ["openness", "change", "acrossCultures"],
  Mage: ["selfAwareness", "communication", "openness"],
  Archer: ["socialAwareness", "diversity", "agreeableness"],
  Acolyte: ["socialSkills", "sociability", "teams"]
};

for (const [expectedCareer, boostedCategories] of Object.entries(careerProfiles)) {
  const answers = {};

  for (const question of questions) {
    const maxAnswer = question.kind === "eq" ? 4 : question.kind === "bigFive" ? 5 : 10;
    answers[question.id] = boostedCategories.includes(question.category) ? maxAnswer : 1;
  }

  const result = calculateProfile(answers);
  if (result.classProfile.title !== expectedCareer) {
    throw new Error(`Expected ${expectedCareer}, received ${result.classProfile.title}`);
  }

  console.log(`${expectedCareer}: passed`);
}

const referenceAnswers = {};
for (const question of questions) {
  referenceAnswers[question.id] = question.kind === "eq" ? 4 : question.kind === "bigFive" ? 3 : 8;
}

const referenceProfile = calculateProfile(referenceAnswers);
const scoreByKey = new Map(referenceProfile.categoryScores.map((score) => [score.key, score]));

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, received ${actual}`);
  }
}

const selfAwareness = scoreByKey.get("selfAwareness");
assertEqual(selfAwareness.raw, 48, "EQ Self-awareness raw score");
assertEqual(selfAwareness.percent, 100, "EQ Self-awareness 0-100 score");
assertEqual(selfAwareness.reference.low, 36, "EQ Self-awareness reference low");
assertEqual(selfAwareness.reference.high, 48, "EQ Self-awareness reference high");

const openness = scoreByKey.get("openness");
assertEqual(openness.raw, 15, "Big Five Openness raw score");
assertEqual(openness.normScore, 50, "Big Five Openness norm score");
assertEqual(openness.percent, 50, "Big Five Openness 0-100 score");

const managingSelf = scoreByKey.get("managingSelf");
assertEqual(managingSelf.raw, 80, "Pro Managing Self raw score");
assertEqual(managingSelf.reference.mean, 78, "Pro Managing Self mean");
assertEqual(managingSelf.reference.low, 69, "Pro Managing Self reference low");
assertEqual(managingSelf.reference.high, 87, "Pro Managing Self reference high");
assertEqual(managingSelf.levelLabel, "อยู่ในกลุ่มคนส่วนใหญ่", "Pro majority label");

function competencyScoreAt(value) {
  const answers = {};
  for (const question of questions) {
    answers[question.id] = question.kind === "eq" ? 2 : question.kind === "bigFive" ? 3 : value;
  }
  return calculateProfile(answers).categoryScores.find((score) => score.key === "managingSelf");
}

assertEqual(
  competencyScoreAt(6).levelLabel,
  "อยู่ในกลุ่มคนส่วนน้อย (คะแนนต่ำกว่าช่วงของคนส่วนใหญ่)",
  "Pro lower minority label"
);
assertEqual(
  competencyScoreAt(10).levelLabel,
  "อยู่ในกลุ่มคนส่วนน้อย (คะแนนสูงกว่าช่วงของคนส่วนใหญ่)",
  "Pro upper minority label"
);

console.log("Reference scoring: passed");
