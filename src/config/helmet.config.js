import helmet from "helmet"

const helmetConfig = helmet({
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    noSniff: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
    },
    referrerPolicy: { policy: "no-referrer" },
    contentSecurityPolicy: false,
});

export default helmetConfig