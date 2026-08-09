const { v4: uuidv4 } = require('crypto');

// In-memory mock database — initialized with seed badges & users
const db = {
  users: new Map(),
  assessments: new Map(),
  badges: new Map(),
};

// Seed Data Initialization
const seedSarahAssessment = {
  _id: 'assess_sarah_1',
  id: 'assess_sarah_1',
  userId: 'user_sarah_jenkins',
  track: 'nodejs-api',
  trackName: 'Node.js API Architecture',
  submittedCode: 'const express = require("express");...',
  aiScores: { quality: 66, logic: 87, performance: 76, overall: 76 },
  aiLevel: 'Intermediate',
  tier: 'Gold',
  strengths: [
    'Good modular code structure with clear separation of concerns',
    'Error handling patterns reflect production-ready thinking',
    'Appropriate use of modern language features and syntax',
  ],
  weaknesses: [
    'Consider adding parameter validation for query strings',
    'Rate limiting recommended for high traffic endpoints',
  ],
  engine: 'simulated',
  submittedAt: new Date(),
};

const seedSarahBadge = {
  _id: 'badge_sarah_1',
  id: 'badge_sarah_1',
  userId: 'user_sarah_jenkins',
  userName: 'Sarah Jenkins',
  assessmentId: 'assess_sarah_1',
  badgeHash: 'd7bc453a491cf51826ad1e535ae95a67745009a058ed9d7c0a27dd3170ded82e',
  shortId: 'D7BC453A491C',
  track: 'nodejs-api',
  trackName: 'Node.js API Architecture',
  overallScore: 76,
  tier: 'Gold',
  level: 'Intermediate',
  issuedAt: new Date(),
};

const seedAlexAssessment = {
  _id: 'assess_alex_1',
  id: 'assess_alex_1',
  userId: 'user_alex_1',
  track: 'react-ui',
  trackName: 'React & UI Engineering',
  submittedCode: 'export function Dropdown({options}) {...}',
  aiScores: { quality: 88, logic: 92, performance: 90, overall: 90 },
  aiLevel: 'Senior',
  tier: 'Platinum',
  strengths: [
    'Flawless state management and component lifecycle optimization',
    'Full accessibility ARIA support and clean responsive styling',
    'Comprehensive error boundaries and prop validation',
  ],
  weaknesses: [
    'Optional: add memoization for large dropdown list rendering',
  ],
  engine: 'simulated',
  submittedAt: new Date(),
};

const seedAlexBadge = {
  _id: 'badge_alex_1',
  id: 'badge_alex_1',
  userId: 'user_alex_1',
  userName: 'Alex Johnson',
  assessmentId: 'assess_alex_1',
  badgeHash: '69ca5ad152fcfd62eaeef18dec0930f92d75585bdacb260265fddbc2',
  shortId: '69CA5AD152FC',
  track: 'react-ui',
  trackName: 'React & UI Engineering',
  overallScore: 90,
  tier: 'Platinum',
  level: 'Senior',
  issuedAt: new Date(),
};

db.assessments.set(seedSarahAssessment.id, seedSarahAssessment);
db.badges.set(seedSarahBadge.id, seedSarahBadge);
db.users.set('user_sarah_jenkins', {
  _id: 'user_sarah_jenkins',
  id: 'user_sarah_jenkins',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@techcorp.io',
  badges: ['badge_sarah_1'],
  createdAt: new Date(),
});

db.assessments.set(seedAlexAssessment.id, seedAlexAssessment);
db.badges.set(seedAlexBadge.id, seedAlexBadge);
db.users.set('user_alex_1', {
  _id: 'user_alex_1',
  id: 'user_alex_1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  badges: ['badge_alex_1'],
  createdAt: new Date(),
});

function generateId() {
  return require('crypto').randomBytes(12).toString('hex');
}

const mockDb = {
  // --- Users ---
  async findUserByEmail(email) {
    for (const user of db.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  },
  async createUser(data) {
    const id = generateId();
    const user = { _id: id, id, ...data, badges: [], createdAt: new Date() };
    db.users.set(id, user);
    return user;
  },
  async findUserById(id) {
    return db.users.get(id) || null;
  },
  async addBadgeToUser(userId, badgeId, userName = 'Candidate') {
    let user = db.users.get(userId);
    if (!user) {
      user = { _id: userId, id: userId, name: userName, email: 'candidate@skillbridge.local', badges: [], createdAt: new Date() };
      db.users.set(userId, user);
    }
    user.badges = user.badges || [];
    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId);
    }
  },
  async getUserWithBadges(userId) {
    const user = db.users.get(userId);
    if (!user) return null;
    const badges = (user.badges || []).map(bid => db.badges.get(bid)).filter(Boolean);
    return { ...user, badges };
  },

  // --- Assessments ---
  async createAssessment(data) {
    const id = generateId();
    const assessment = { _id: id, id, ...data, submittedAt: new Date() };
    db.assessments.set(id, assessment);
    return assessment;
  },
  async findAssessmentById(id) {
    return db.assessments.get(id) || null;
  },

  // --- Badges ---
  async createBadge(data) {
    const id = generateId();
    const badge = { _id: id, id, ...data, issuedAt: new Date() };
    db.badges.set(id, badge);
    return badge;
  },
  async findBadgeByHash(hash) {
    if (!hash) return null;
    const clean = hash.trim().toUpperCase().replace(/^#/, '');
    for (const badge of db.badges.values()) {
      if (
        badge.badgeHash?.toLowerCase() === hash.trim().toLowerCase() ||
        badge.shortId?.toUpperCase() === clean ||
        badge.id === hash ||
        badge._id === hash
      ) {
        return badge;
      }
    }
    return null;
  },
  async findBadgeById(id) {
    return db.badges.get(id) || null;
  },
  async getBadgeWithAssessment(hash) {
    const badge = await mockDb.findBadgeByHash(hash);
    if (!badge) return null;
    const assessment = await mockDb.findAssessmentById(badge.assessmentId);
    const user = await mockDb.findUserById(badge.userId);
    return { badge, assessment, user };
  },
};

module.exports = mockDb;
