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
  belbinRoleIds,
  belbinScoringKey,
  belbinSectionIds,
  calculateBelbinResult,
  countCompletedBelbinSections,
  sanitizeBelbinAnswers
} = loadTypeScriptModule("src/lib/belbin-assessment.ts");

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, received ${actual}`);
  }
}

const allShaperAnswers = Object.fromEntries(
  belbinSectionIds.map((sectionId) => [sectionId, { [belbinScoringKey[sectionId].SH]: 10 }])
);
const allShaperResult = calculateBelbinResult(allShaperAnswers);
assertEqual(allShaperResult.scores.SH, 70, "SH receives the mapped score from every section");
assertEqual(allShaperResult.featuredRoles[0].id, "SH", "SH is the top role");
assertEqual(
  belbinRoleIds.reduce((sum, roleId) => sum + allShaperResult.scores[roleId], 0),
  70,
  "Role scores preserve all allocated points"
);

const cutoffTieAnswers = {
  A: { [belbinScoringKey.A.SH]: 10 },
  B: { [belbinScoringKey.B.SH]: 10 },
  C: { [belbinScoringKey.C.SH]: 10 },
  D: { [belbinScoringKey.D.CO]: 10 },
  E: { [belbinScoringKey.E.CO]: 10 },
  F: { [belbinScoringKey.F.PL]: 10 },
  G: { [belbinScoringKey.G.PL]: 10 }
};
const cutoffTieResult = calculateBelbinResult(cutoffTieAnswers);
assertEqual(cutoffTieResult.featuredRoles.length, 3, "A tie at second place shows every tied role");
assertEqual(cutoffTieResult.hasCutoffTie, true, "Second-place tie is flagged");

assertEqual(calculateBelbinResult({ A: { 3: 10 } }), null, "Incomplete assessment is rejected");
assertEqual(countCompletedBelbinSections({ A: { 3: 6, 4: 5 } }), 0, "A section over 10 is incomplete");
assertEqual(countCompletedBelbinSections({ A: { 3: 6, 4: 4 } }), 1, "A valid section is complete");

const sanitized = sanitizeBelbinAnswers({
  A: { 1: 5, 2: 3, 3: 2, 4: 9 },
  B: { 0: 10, 9: 10, 2: -1 },
  Z: { 1: 10 }
});
assertEqual(Object.keys(sanitized.A).length, 3, "Stored sections keep at most three valid items");
assertEqual(sanitized.B, undefined, "Invalid stored section values are removed");

console.log("Belbin scoring key: passed");
console.log("Belbin cutoff tie handling: passed");
console.log("Belbin state validation: passed");
