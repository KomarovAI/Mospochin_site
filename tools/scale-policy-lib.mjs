export function evaluateScalePolicy(policy, report, { strict = false } = {}) {
  const s = report.summary || report;
  const failures = [];
  const warnings = [];
  const fail = (message) => failures.push(message);
  const warn = (message) => warnings.push(message);
  const hard = policy.hardGates || {};
  if (hard.builderParityRequired && Number(s.rootHtmlPages) !== Number(s.builderPages)) {
    fail(`Builder parity broken: rootHtmlPages=${s.rootHtmlPages}, builderPages=${s.builderPages}`);
  }
  const missingCount = Number((report.missingFiles || []).length || s.missingSourceFiles || 0);
  if (missingCount > Number(hard.missingSourceFilesAllowed ?? 0)) fail(`Missing source files: ${missingCount}`);
  const ratio = Number(s.sharedCoverageRatio || 0);
  if (ratio < Number(hard.minimumSharedCoverageRatio || 0)) fail(`Shared/parametric coverage ${(ratio*100).toFixed(1)}% below ${(Number(hard.minimumSharedCoverageRatio)*100).toFixed(1)}%`);
  if (Number(s.averageSectionsPerPage || 0) > Number(hard.maxAverageSectionsPerPage ?? Infinity)) fail(`Average sections/page ${s.averageSectionsPerPage} exceeds ${hard.maxAverageSectionsPerPage}`);
  if (Number(s.averageSourceFilesPerPage || 0) > Number(hard.maxAverageSourceFilesPerPage ?? Infinity)) fail(`Average source files/page ${s.averageSourceFilesPerPage} exceeds ${hard.maxAverageSourceFilesPerPage}`);
  for (const gate of policy.stageGates || []) {
    if (Number(s.builderPages || 0) < Number(gate.minPages || 0)) continue;
    if (gate.block) fail(`Numeric stage blocking is forbidden: ${gate.minPages}+`);
    if (gate.minimumSharedCoverageRatio != null && ratio < Number(gate.minimumSharedCoverageRatio)) fail(`Stage ${gate.minPages}+ coverage ${(ratio*100).toFixed(1)}% below ${(Number(gate.minimumSharedCoverageRatio)*100).toFixed(1)}%: ${gate.message || ''}`);
    if (gate.maxAverageSectionsPerPage != null && Number(s.averageSectionsPerPage || 0) > Number(gate.maxAverageSectionsPerPage)) fail(`Stage ${gate.minPages}+ average sections/page exceeded: ${gate.message || ''}`);
    if (gate.maxAverageSourceFilesPerPage != null && Number(s.averageSourceFilesPerPage || 0) > Number(gate.maxAverageSourceFilesPerPage)) fail(`Stage ${gate.minPages}+ average source files/page exceeded: ${gate.message || ''}`);
  }
  const hardStop = policy.pageBudget?.hardStopAtPages;
  if (hardStop != null) fail(`Numeric hardStopAtPages is forbidden; found ${hardStop}`);
  const t=policy.warningThresholds||{};
  for (const p of report.pages || []) {
    if (t.maxSectionsPerPage != null && Number(p.sectionCount||0)>Number(t.maxSectionsPerPage)) warn(`${p.page}: sections ${p.sectionCount} > ${t.maxSectionsPerPage}`);
    if (t.maxLocalSectionsPerPage != null && Number(p.localSections||0)>Number(t.maxLocalSectionsPerPage)) warn(`${p.page}: local sections ${p.localSections} > ${t.maxLocalSectionsPerPage}`);
    if (t.maxRawSectionsPerPage != null && Number(p.rawSections||0)>Number(t.maxRawSectionsPerPage)) warn(`${p.page}: raw sections ${p.rawSections} > ${t.maxRawSectionsPerPage}`);
    if (t.maxSourceFilesPerPage != null && Number(p.sourceFileCount||0)>Number(t.maxSourceFilesPerPage)) warn(`${p.page}: source files ${p.sourceFileCount} > ${t.maxSourceFilesPerPage}`);
  }
  return { failures: strict ? [...failures, ...warnings.map(w=>`Strict warning: ${w}`)] : failures, warnings, summary:s };
}
