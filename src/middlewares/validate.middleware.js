export default function validate(schema) {
    return (req, res, next) => {

        try {
            const validated = schema.safeParse(req.body)

            if (!validated.success) {
                return res.status(400).json({
                    message: "Invalid requisition",
                    error: validated.error.issues
                })
            }
            next()

        } catch (err) {
            return res.status(500).json({
                message: "Internal server error",
                error: err.message
            })
        }
    }
}