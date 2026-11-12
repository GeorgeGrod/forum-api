import type { RequestHandler } from "express";



export function RequireAuth(verifyAccessToken: (token: string) => number): RequestHandler {
    return (req, res, next) => {
        const token = req.cookies?.accessToken
        if(typeof token !== "string") {
            res.status(401).json({message: "Unauthorized"})
            return
        }

        try {
            res.locals.userId = verifyAccessToken(token)
            next()
        }catch(error) {
            res.status(401).json({message: "Unauthorized"})
        }
    };
}