import { Router } from "express"
import validate from "../middlewares/validate.middleware.js"
import * as studyController from "../controller/study-plan.controller.js"

const studyRouter = Router()

studyRouter.post("/",
    // validate(),
    studyController.createTeachingPlan
)

export default studyRouter