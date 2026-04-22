#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const RECIPES_PATH = path.join(REPO_ROOT, 'data/operator-recipes.json');
const PAGE_METADATA_PATH = path.join(REPO_ROOT, 'data/page-metadata.json');
const ALLOWED_BRANCHES = new Set(['household', 'restaurant', 'shared']);

function exitWithError(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    exitWithError(`failed to read ${label}: ${error.message}`);
  }
}

function parseArgs(argv) {
  const args = {
    intent: null,
    page: null,
    branch: null,
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--json') {
      args.json = true;
      continue;
    }

    if (token === '--intent' || token === '--page' || token === '--branch') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        exitWithError(`missing value for ${token}`);
      }

      if (token === '--intent') {
        args.intent = value;
      } else if (token === '--page') {
        args.page = value;
      } else {
        args.branch = value;
      }

      index += 1;
      continue;
    }

    exitWithError(`unknown argument: ${token}`);
  }

  if (!args.intent) {
    exitWithError('`--intent <value>` is required');
  }

  if (args.branch && !ALLOWED_BRANCHES.has(args.branch)) {
    exitWithError(`unsupported branch '${args.branch}'; expected household, restaurant, or shared`);
  }

  return args;
}

function getPageBranch(pageMetadata, page) {
  const pageRecord = pageMetadata.pages?.[page];
  if (!pageRecord) {
    exitWithError(`page '${page}' is not defined in data/page-metadata.json`);
  }

  const branch = pageRecord.branch;
  if (branch !== 'household' && branch !== 'restaurant') {
    exitWithError(`page '${page}' has unsupported branch '${branch}' for recipe selection`);
  }

  return branch;
}

function findCandidates(recipes, intent) {
  const recipeIdMatches = recipes.filter((recipe) => recipe.id === intent);
  if (recipeIdMatches.length > 0) {
    return {
      resolvedFrom: 'recipe-id',
      candidates: recipeIdMatches,
    };
  }

  const intentMatches = recipes.filter((recipe) => recipe.intent === intent);
  return {
    resolvedFrom: 'intent+page',
    candidates: intentMatches,
  };
}

function ensureUniqueRecipe(recipes, hint) {
  if (recipes.length === 0) {
    exitWithError(`no recipe matched ${hint}`);
  }

  if (recipes.length > 1) {
    const ids = recipes.map((recipe) => recipe.id).join(', ');
    exitWithError(`ambiguous recipe match for ${hint}; candidates: ${ids}`);
  }

  return recipes[0];
}

function resolveRecipe(recipes, pageMetadata, args) {
  const { resolvedFrom, candidates } = findCandidates(recipes, args.intent);
  if (candidates.length === 0) {
    exitWithError(`unknown recipe id or intent '${args.intent}'`);
  }

  const pageBranch = args.page ? getPageBranch(pageMetadata, args.page) : null;

  if (args.branch && pageBranch && args.branch !== pageBranch) {
    exitWithError(
      `branch '${args.branch}' does not match page '${args.page}' branch '${pageBranch}'`,
    );
  }

  const effectiveBranch = args.branch ?? pageBranch ?? null;
  let filtered = candidates;

  if (effectiveBranch) {
    filtered = filtered.filter((recipe) => recipe.branch === effectiveBranch);
  }

  if (pageBranch) {
    filtered = filtered.filter((recipe) => recipe.branch === pageBranch);
  }

  const recipe = ensureUniqueRecipe(
    filtered,
    effectiveBranch ? `'${args.intent}' with branch '${effectiveBranch}'` : `'${args.intent}'`,
  );

  if (recipe.branch === 'shared' && pageBranch && pageBranch !== 'shared') {
    exitWithError(`shared recipe '${recipe.id}' cannot be resolved against page '${args.page}'`);
  }

  if (effectiveBranch && recipe.branch !== effectiveBranch) {
    exitWithError(`recipe '${recipe.id}' does not belong to branch '${effectiveBranch}'`);
  }

  if (!effectiveBranch && recipe.branch !== 'shared' && resolvedFrom !== 'recipe-id' && args.page === null) {
    exitWithError(`branch-specific intent '${args.intent}' requires --page or --branch`);
  }

  return { recipe, resolvedFrom };
}

function formatRecipeSummary(recipe, resolvedFrom) {
  const lines = [
    `recipe id: ${recipe.id}`,
    `resolved from: ${resolvedFrom}`,
    `branch: ${recipe.branch}`,
    `page kind: ${recipe.pageKind}`,
    `preferred edit surface: ${recipe.preferredEditSurface}`,
    `entry command: ${recipe.entryCommand}`,
    `allowed commands: ${recipe.allowedCommands.join(' | ')}`,
    `validation command: ${recipe.validationCommand}`,
  ];

  if (recipe.syncCommand) {
    lines.splice(7, 0, `sync command: ${recipe.syncCommand}`);
  }

  return lines.join('\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const recipeData = readJson(RECIPES_PATH, 'data/operator-recipes.json');
  const pageMetadata = readJson(PAGE_METADATA_PATH, 'data/page-metadata.json');
  const { recipe, resolvedFrom } = resolveRecipe(recipeData.recipes ?? [], pageMetadata, args);

  const output = {
    id: recipe.id,
    resolvedFrom,
    branch: recipe.branch,
    pageKind: recipe.pageKind,
    preferredEditSurface: recipe.preferredEditSurface,
    entryCommand: recipe.entryCommand,
    allowedCommands: recipe.allowedCommands,
    syncCommand: recipe.syncCommand,
    validationCommand: recipe.validationCommand,
  };

  if (args.json) {
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  console.log(formatRecipeSummary(recipe, resolvedFrom));
}

main();
