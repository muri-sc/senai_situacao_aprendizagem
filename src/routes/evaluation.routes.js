import { Router } from 'express';
import { processStudentEvaluation } from "../controller/evaluation.controller.js";

const evaluationRouter = Router()

evaluationRouter.post('/evaluate', processStudentEvaluation);

export default evaluationRouter;