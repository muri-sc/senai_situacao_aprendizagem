import router from './index.js';
const evaluationController = require('../controllers/evaluationController');

// Define a rota POST para avaliação
router.post('/evaluate', evaluationController.processStudentEvaluation);

module.exports = router;