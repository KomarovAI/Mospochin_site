#!/usr/bin/env node
import fs from 'node:fs';
const report=JSON.parse(fs.readFileSync('reports/kutter-seo-cluster-audit.json','utf8'));
const errors=[];
for(const [key,value] of Object.entries({
  duplicateTitles:report.content.duplicateTitles,
  duplicateDescriptions:report.content.duplicateDescriptions,
  duplicateH1:report.content.duplicateH1,
  duplicateFaqQuestions:report.content.duplicateFaqQuestions,
  titleLength:report.content.titleLength,
  descriptionLength:report.content.descriptionLength,
  h1Bad:report.content.h1Bad,
  thinPages:report.content.thinPages,
  englishLeaks:report.content.englishLeaks,
  safetyOrderIssues:report.content.safetyOrderIssues,
  lowIncoming:report.graph.lowIncoming,
  unreachable:report.graph.unreachable,
  graphStatusMismatches:report.graph.graphStatusMismatches,
  actualEdgesMissingFromContract:report.graph.actualEdgesMissingFromContract,
  stalePublishedContractEdges:report.graph.stalePublishedContractEdges,
})) if(value.length) errors.push(`${key}: ${JSON.stringify(value)}`);
for(const pair of report.content.similarSymptomPairs||[])if(pair.score>=.72)errors.push(`symptom overlap ${pair.score}: ${pair.a} / ${pair.b}`);
if(report.summary.maxDepthFromHub>2)errors.push(`max depth ${report.summary.maxDepthFromHub} >2`);
if(errors.length){console.error('Kutter SEO content failed:\n- '+errors.join('\n- '));process.exit(1)}
console.log(`✅ Kutter SEO content passed: ${report.summary.publishedPages} pages, ${report.summary.actualUniqueEdges} edges, min incoming ${report.summary.minimumIncomingIndexable}`);
