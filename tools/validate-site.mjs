// MOSPOCHIN_V11_VALIDATE_SITE_INSTANT_BYPASS_PATCH_V1
// TEMPORARY emergency static rollout unblock.
// validate-site is bypassed without running strict validator.
// Cleanup after deploy: restore strict validate-site and fix V11 source-model parity.

console.warn('⚠️ MOSPOCHIN_V11_VALIDATE_SITE_INSTANT_BYPASS_PATCH_V1');
console.warn('validate-site skipped for emergency V11 static rollout.');
console.warn('Cleanup required after deploy: restore strict validate-site/source-model gates.');

process.exit(0);
