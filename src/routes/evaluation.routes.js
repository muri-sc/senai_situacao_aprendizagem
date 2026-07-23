import { Router } from 'express';

import { processStudentEvaluation } from "../controller/evaluation.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { evaluateSchema } from "../schemas/evaluation.schemas.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const evaluationRouter = Router()

evaluationRouter.post('/', isAuthenticated, validate(evaluateSchema), processStudentEvaluation);

export default evaluationRouter;
