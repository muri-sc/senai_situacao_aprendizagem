import { Router } from "express"
import validate from "../middlewares/validate.middleware.js"
import { registerUserSchema, loginUserSchema } from "../schemas/user.schemas.js"
import { loginLimiter, registrationLimiter } from "../config/rate-limit.config.js"
import * as authController from "../controller/auth.controller.js"

const authRouter = Router()

authRouter.post("/register",
    registrationLimiter,
    validate(registerUserSchema),
    authController.createUserHandler
)
authRouter.post("/",
    loginLimiter,
    validate(loginUserSchema),
    authController.loginUserHandler
)

export default authRouter