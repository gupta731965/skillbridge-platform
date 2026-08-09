const express = require('express');
const router = express.Router();
const { evaluate, getAssessment, getTrackTasks, getTracks } = require('../controllers/evaluationController');

router.post('/evaluate', evaluate);
router.get('/tracks', getTracks);
router.get('/track/:track/task', getTrackTasks);
router.get('/:id', getAssessment);

module.exports = router;
