import { Router } from 'express';
import * as evaluationController from '../controllers/evaluationController.js';

evaluationRouter = Router()

evaluationRouter.post('/evaluate', evaluationController.processStudentEvaluation);

export default evaluationRouter;