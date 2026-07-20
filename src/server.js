import "dotenv/config"
import app from "./app.js"
import sequelize from "./database/connection.js"
import "./model/user.model.js"
import "./model/question.model.js"

const requiredEnvs = [
    "PORT",
    "DB_HOST",
    "DB_PORT",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "SALT_ROUNDS",
    "JWT_SECRET",
    "JWT_EXPIRES_IN"
]

for (const env of requiredEnvs) {
    if (!process.env[env]) throw new Error("Incomplete .env")
}

const PORT = process.env.PORT

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}).catch(err => console.log(`Internal server error: ${err}`))