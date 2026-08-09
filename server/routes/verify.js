const express = require('express');
const router = express.Router();
const { verifyBadge } = require('../controllers/verificationController');

router.get('/:hash', verifyBadge);

module.exports = router;
