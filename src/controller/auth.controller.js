import { User } from "../model/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export {
    createUserHandler,
    loginUserHandler
}

async function createUserHandler(req, res) {
    try {
        const { name, email, password } = req.body

        const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)

        const userExists = await User.findOne({ where: { email: email } })
        if (userExists) {
            if (!userExists.active) {
                const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

                await userExists.update({
                    active: true,
                    name: name,
                    password: passwordHash
                })
                return res.status(200).json({ message: "User reactivated" })
            }
            return res.status(409).json({ message: "User already exists" })
        }
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
        const createdUser = await User.create({
            name: name,
            email: email,
            password: passwordHash
        })
        const userResponse = createdUser.toJSON()
        delete userResponse.password

        return res.status(201).json({ message: "Sucessfull registration", data: userResponse })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

async function loginUserHandler(req, res) {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ where: { email: email, active: true } })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const JWT_SECRET = process.env.JWT_SECRET
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

        const payload = {
            id: user.id,
            name: user.name,
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        return res.status(200).json({ message: "Sucessful login", data: { token: token, user: payload } })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}
