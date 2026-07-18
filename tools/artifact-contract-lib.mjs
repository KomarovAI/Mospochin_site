import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const ARTIFACT_SCHEMA_VERSION = 1;
export const PROJECT_ID = 'mospochin-site';
export const ARTIFACT_TYPES = new Set([
  'source-handoff',
  'source-handoff-lite',
  'public-deploy',
  'overlay-patch',
  'visual-evidence',
  'media-masters',
]);

export function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function sha256File(filePath) {
  return sha256Buffer(fs.readFileSync(filePath));
}

export function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

export function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function createArtifactContract({
  artifactType,
  deployable,
  packageVersion = '0.0.0',
  source = {},
  contents = {},
  requirements = {},
  notes = [],
  createdAt = new Date().toISOString(),
}) {
  if (!ARTIFACT_TYPES.has(artifactType)) {
    throw new Error(`Unsupported artifactType: ${artifactType}`);
  }
  if (typeof deployable !== 'boolean') {
    throw new Error('deployable must be boolean');
  }

  return {
    schemaVersion: ARTIFACT_SCHEMA_VERSION,
    project: PROJECT_ID,
    artifactType,
    deployable,
    createdAt,
    packageVersion,
    source: {
      githubSha: source.githubSha || process.env.GITHUB_SHA || '',
      githubRef: source.githubRef || process.env.GITHUB_REF || '',
      node: source.node || process.version,
    },
    contents,
    requirements: {
      requiredWorkflow: requirements.requiredWorkflow || 'Deploy to VPS',
      minimumNodeMajor: requirements.minimumNodeMajor || 22,
      ...requirements,
    },
    notes,
  };
}

export function validateArtifactContract(contract, { expectType = null, requireDeployable = null } = {}) {
  const errors = [];
  if (!contract || typeof contract !== 'object' || Array.isArray(contract)) {
    return ['artifact.json must contain a JSON object'];
  }
  if (contract.schemaVersion !== ARTIFACT_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${ARTIFACT_SCHEMA_VERSION}`);
  }
  if (contract.project !== PROJECT_ID) errors.push(`project must be ${PROJECT_ID}`);
  if (!ARTIFACT_TYPES.has(contract.artifactType)) errors.push(`unsupported artifactType: ${contract.artifactType}`);
  if (typeof contract.deployable !== 'boolean') errors.push('deployable must be boolean');
  if (!contract.createdAt || Number.isNaN(Date.parse(contract.createdAt))) errors.push('createdAt must be ISO-8601');
  if (expectType && contract.artifactType !== expectType) {
    errors.push(`artifactType must be ${expectType}, got ${contract.artifactType}`);
  }
  if (requireDeployable !== null && contract.deployable !== requireDeployable) {
    errors.push(`deployable must be ${requireDeployable}`);
  }
  if (contract.artifactType === 'public-deploy' && contract.deployable !== true) {
    errors.push('public-deploy artifact must be deployable=true');
  }
  if (contract.artifactType !== 'public-deploy' && contract.deployable === true) {
    errors.push(`${contract.artifactType} artifact must not be deployable`);
  }
  if (!Number.isInteger(contract.requirements?.minimumNodeMajor) || contract.requirements.minimumNodeMajor < 22) {
    errors.push('requirements.minimumNodeMajor must be an integer >= 22');
  }
  if (contract.artifactType === 'public-deploy') {
    if (!/^[0-9a-f]{16}$/i.test(String(contract.contents?.releaseId || ''))) {
      errors.push('public-deploy contents.releaseId must be a 16-character hexadecimal release identity');
    }
    if (!/^[0-9a-f]{64}$/i.test(String(contract.contents?.runtimePayloadSha256 || ''))) {
      errors.push('public-deploy contents.runtimePayloadSha256 must be a SHA-256');
    }
  }
  return errors;
}
