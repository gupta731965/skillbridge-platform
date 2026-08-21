const mockDb = require('../services/mockDb');
const mongoose = require('mongoose');

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

      const raw = hash.trim();
      const clean = raw.toUpperCase().replace(/^#/, '');
      const lower = raw.toLowerCase();

      const searchConditions = [
        { badgeHash: raw },
        { badgeHash: lower },
        { shortId: clean },
        { shortId: raw.toUpperCase() }
      ];

      if (mongoose.Types.ObjectId.isValid(raw)) {
        searchConditions.push({ _id: raw });
      }

      const badge = await Badge.findOne({ $or: searchConditions });

      if (!badge) {
        return res.status(404).json({
          verified: false,
          error: 'Badge not found. This credential may be invalid or has been tampered with.'
        });
      }

      let assessment = null;
      if (badge.assessmentId) {
        if (mongoose.Types.ObjectId.isValid(badge.assessmentId)) {
          assessment = await Assessment.findById(badge.assessmentId);
        } else {
          assessment = await Assessment.findOne({ $or: [{ id: badge.assessmentId }, { _id: badge.assessmentId }] }).catch(() => null);
        }
      }

      let user = null;
      if (badge.userId) {
        if (mongoose.Types.ObjectId.isValid(badge.userId)) {
          user = await User.findById(badge.userId).select('name email createdAt');
        } else {
          user = await User.findOne({ $or: [{ id: badge.userId }, { _id: badge.userId }] }).select('name email createdAt').catch(() => null);
        }
      }

      result = { badge, assessment, user };
    }

    if (!result || !result.badge) {
      return res.status(404).json({ 
        verified: false,
        error: 'Badge not found. This credential may be invalid or has been tampered with.' 
      });
    }

    const candidateName = (result.user && result.user.name) || result.badge.userName || 'Verified Candidate';
    const candidateEmail = (result.user && result.user.email) || 'candidate@skillbridge.io';

    res.json({
      verified: true,
      badge: {
        ...result.badge.toObject ? result.badge.toObject() : result.badge,
        userName: candidateName,
      },
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
      candidate: {
        name: candidateName,
        email: candidateEmail,
      },
    });
  } catch (err) {
    console.error('[Verify] Error:', err);
    res.status(500).json({ error: 'Verification failed', details: err.message });
  }
};
