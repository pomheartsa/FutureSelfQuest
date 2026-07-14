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
