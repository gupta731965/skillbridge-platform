const { evaluateSubmission } = require('../services/aiEvaluator');
const { generateBadgeHash, getShortId } = require('../services/hashService');
const mockDb = require('../services/mockDb');

const TRACK_NAMES = {
  'react-ui': 'React & UI Engineering',
  'nodejs-api': 'Node.js API Architecture',
  'python-data': 'Python Data Handling',
  'system-design': 'System Design & Architecture',
  'typescript-fullstack': 'TypeScript Full-Stack',
  'devops-cloud': 'DevOps & Cloud Infrastructure',
};

const TRACK_TASKS = {
  'react-ui': `Build a reusable React component called <SearchableDropdown> that:
1. Accepts an array of options (objects with id and label)
2. Allows keyboard navigation (arrow keys, Enter to select, Escape to close)
3. Filters options on input change
4. Supports a placeholder prop and an onChange callback
5. Is fully accessible (ARIA attributes)`,

  'nodejs-api': `Design and implement a RESTful Express.js route for a /products resource that:
1. Handles GET (list + filter by category), POST (create), PUT (update), DELETE (soft delete)
2. Includes input validation middleware
3. Returns proper HTTP status codes and JSON error responses
4. Implements pagination (page, limit query params)
5. Includes rate limiting logic`,

  'python-data': `Write a Python function that processes a list of sales records (dicts with date, amount, category):
1. Groups sales by category and computes total + average per category
2. Identifies the top 3 performing categories
3. Generates a monthly trend report
4. Handles missing/null values gracefully
5. Returns results as a clean dictionary`,

  'system-design': `Describe and partially implement a URL Shortener service that:
1. Encodes long URLs to 6-8 char unique slugs (explain your algorithm)
2. Handles 10M+ daily requests (describe caching strategy)
3. Includes redirect analytics tracking
4. Supports custom slugs with conflict resolution
5. Outline the database schema and key design decisions`,

  'typescript-fullstack': `Create a TypeScript utility library with the following:
1. A generic Result<T, E> type for explicit error handling
2. A pipe() function for function composition
3. A memoize() higher-order function with TTL support
4. A strongly-typed EventEmitter class
5. Proper JSDoc comments and exported type definitions`,

  'devops-cloud': `Write infrastructure-as-code (Dockerfile + docker-compose.yml) for a Node.js app that:
1. Uses multi-stage Docker build to minimize image size
2. Includes a Redis service for caching
3. Sets up health checks for all services
4. Configures environment variable injection
5. Includes a Nginx reverse proxy with basic rate limiting`,
};

exports.evaluate = async (req, res) => {
  try {
    const { userId, track, code, userName } = req.body;

    if (!userId || !track || !code) {
      return res.status(400).json({ error: 'userId, track, and code are required' });
    }

    if (code.trim().length < 10) {
      return res.status(400).json({ error: 'Code submission is too short. Please provide a meaningful solution.' });
    }

    const trackName = TRACK_NAMES[track];
    if (!trackName) {
      return res.status(400).json({ error: `Invalid track. Valid tracks: ${Object.keys(TRACK_NAMES).join(', ')}` });
    }

    // Run AI evaluation
    console.log(`[Evaluate] Running evaluation for track: ${track}, user: ${userId}`);
    const evaluation = await evaluateSubmission(code, track);

    // Save assessment
    const assessmentData = {
      userId,
      track,
      trackName,
      submittedCode: code,
      aiScores: {
        quality: evaluation.quality,
        logic: evaluation.logic,
        performance: evaluation.performance,
        overall: evaluation.overall,
      },
      aiLevel: evaluation.level,
      tier: evaluation.tier,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      engine: evaluation.engine,
    };

    let assessment;
    if (process.env.USE_MOCK_DB === 'true') {
      assessment = await mockDb.createAssessment(assessmentData);
    } else {
      const Assessment = require('../models/Assessment');
      assessment = await new Assessment(assessmentData).save();
    }

    // Generate tamper-evident badge hash
    const timestamp = Date.now();
    const badgeHash = generateBadgeHash(userId, assessment.id || assessment._id, timestamp);
    const shortId = getShortId(badgeHash);

    const badgeData = {
      userId,
      userName: userName || 'Anonymous',
      assessmentId: assessment.id || assessment._id.toString(),
      badgeHash,
      shortId,
      track,
      trackName,
      overallScore: evaluation.overall,
      tier: evaluation.tier,
      level: evaluation.level,
    };

    let badge;
    if (process.env.USE_MOCK_DB === 'true') {
      badge = await mockDb.createBadge(badgeData);
      await mockDb.addBadgeToUser(userId, badge.id, userName);
    } else {
      const Badge = require('../models/Badge');
      const User = require('../models/User');
      badge = await new Badge(badgeData).save();
      await User.findByIdAndUpdate(userId, { $push: { badges: badge._id } });
    }

    res.status(201).json({
      success: true,
      assessment,
      badge,
      evaluation,
    });

  } catch (err) {
    console.error('[Evaluate] Error:', err);
    res.status(500).json({ error: 'Evaluation failed. Please try again.', details: err.message });
  }
};

exports.getAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    let assessment;

    if (process.env.USE_MOCK_DB === 'true') {
      assessment = await mockDb.findAssessmentById(id);
    } else {
      const Assessment = require('../models/Assessment');
      assessment = await Assessment.findById(id);
    }

    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTrackTasks = async (req, res) => {
  const { track } = req.params;
  const task = TRACK_TASKS[track];
  if (!task) return res.status(404).json({ error: 'Track not found' });
  res.json({ track, taskDescription: task, trackName: TRACK_NAMES[track] });
};

exports.getTracks = async (req, res) => {
  const tracks = Object.entries(TRACK_NAMES).map(([id, name]) => ({
    id, name, task: TRACK_TASKS[id],
  }));
  res.json(tracks);
};
