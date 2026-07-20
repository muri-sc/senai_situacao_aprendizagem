import { User } from "../model/user.model.js"
import bcrypt from "bcryptjs"

export {
    getProfileHandler,
    updateProfileHandler,
    deleteAccountHandler
}

async function getProfileHandler(req, res) {
    try {
        const { id, name } = req.user

        res.status(200).json({ data: { id: id, name: name } })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}

async function updateProfileHandler(req, res) {
    try {
        const { id } = req.user
        const { name, email, password } = req.body

        const userExists = await User.findOne({ where: { email } })
        if (userExists && userExists.id !== id) {
            return res.status(409).json({ message: "User already exists" })
        }
        const user = await User.findByPk(id)

        const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
        await user.update({
            name: name,
            email: email,
            password: passwordHash
        })
        const userResponse = user.toJSON()
        delete userResponse.password

        return res.status(200).json({ message: "Sucessful update", data: userResponse })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

async function deleteAccountHandler(req, res) {
    try {
        const { id } = req.user

        const user = await User.findByPk(id)

        await user.update({
            active: false
        })
        return res.sendStatus(204)
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })
    }
}
