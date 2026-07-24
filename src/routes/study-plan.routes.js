import { Router } from "express"
import validate from "../middlewares/validate.middleware.js"
import { createStudyPlanSchema } from "../schemas/study-plan.schemas.js"
import * as studyController from "../controller/study-plan.controller.js"
import * as remedialController from "../controller/remedial-study-plan.controller.js"
import isAuthenticated from "../middlewares/auth.middleware.js"
import ensureAnsweredStudyPlan from "../middlewares/ensure-answered-study-plan.middleware.js"

const studyRouter = Router()

studyRouter.post("/",
    isAuthenticated,
    validate(createStudyPlanSchema),
    studyController.createTeachingPlan
)

studyRouter.post("/remedial",
    isAuthenticated,
    ensureAnsweredStudyPlan,
    remedialController.createRemedialTeachingPlan
)

export default studyRouter