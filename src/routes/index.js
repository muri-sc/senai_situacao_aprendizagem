import { Router } from "express"
import authRouter from "./auth.routes.js"
import userRouter from "./user.routes.js"
import studyRouter from "./study-plan.routes.js"

const router = Router()

router.use("/auth", authRouter)
router.use("/user", userRouter)
router.use("/study", studyRouter)

export default router