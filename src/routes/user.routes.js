import { Router } from "express"
import validate from "../middlewares/validate.middleware.js"
import { updateUserSchema } from "../schemas/user.schemas.js"
import * as userController from "../controller/user.controller.js"
import isAuthenticated from "../middlewares/auth.middleware.js"

const userRouter = Router()

userRouter.get("/",
    isAuthenticated,
    userController.getProfileHandler
)
userRouter.put("/",
    isAuthenticated,
    validate(updateUserSchema),
    userController.updateProfileHandler
)
userRouter.delete("/",
    isAuthenticated,
    userController.deleteAccountHandler
)

export default userRouter