import rateLimit from "express-rate-limit"

export {
    globalLimiter,
    loginLimiter,
    registrationLimiter
}

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        error: "Too many requests, try again in 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
})

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        error: "Too many requests, try again in 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
})

const registrationLimiter = rateLimit({
    max: 5,
    message: {
        error: "Too many requests, try again in 1 hour",
    },
    standardHeaders: true,
    legacyHeaders: false,
})