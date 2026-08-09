const mockDb = require('../services/mockDb');

exports.verifyBadge = async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash || hash.trim().length < 4) {
      return res.status(400).json({ error: 'Invalid badge hash or short ID format' });
    }

    let result;
    if (process.env.USE_MOCK_DB === 'true') {
      result = await mockDb.getBadgeWithAssessment(hash);
    } else {
      const Badge = require('../models/Badge');
      const Assessment = require('../models/Assessment');
      const User = require('../models/User');

      const clean = hash.trim().toUpperCase().replace(/^#/, '');
      const badge = await Badge.findOne({
        $or: [{ badgeHash: hash.trim() }, { shortId: clean }, { _id: hash.trim() }]
      });
      if (!badge) return res.status(404).json({ error: 'Badge not found. This credential may be invalid.' });

      const assessment = await Assessment.findById(badge.assessmentId);
      const user = await User.findById(badge.userId).select('name email createdAt');
      result = { badge, assessment, user };
    }

    if (!result || !result.badge) {
      return res.status(404).json({ 
        verified: false,
        error: 'Badge not found. This credential may be invalid or has been tampered with.' 
      });
    }

    res.json({
      verified: true,
      badge: result.badge,
      assessment: result.assessment ? {
        track: result.assessment.track,
        trackName: result.assessment.trackName,
        aiScores: result.assessment.aiScores,
        aiLevel: result.assessment.aiLevel,
        tier: result.assessment.tier,
        strengths: result.assessment.strengths,
        weaknesses: result.assessment.weaknesses,
        submittedAt: result.assessment.submittedAt,
        engine: result.assessment.engine,
      } : null,
      candidate: result.user ? {
        name: result.user.name || result.badge.userName,
        email: result.user.email,
      } : { name: result.badge.userName },
    });
  } catch (err) {
    console.error('[Verify] Error:', err);
    res.status(500).json({ error: 'Verification failed', details: err.message });
  }
};
