const crypto = require('crypto');

/**
 * Generates a tamper-evident badge hash using SHA-256
 * The hash encodes userId + assessmentId + timestamp making it unique and non-reversible.
 */
function generateBadgeHash(userId, assessmentId, timestamp) {
  const payload = `${userId}:${assessmentId}:${timestamp}:skillbridge-v1`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Generates a short display-friendly ID from the full hash
 */
function getShortId(fullHash) {
  return fullHash.substring(0, 12).toUpperCase();
}

module.exports = { generateBadgeHash, getShortId };
