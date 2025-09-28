import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET;


export const authUser = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) return res.status(401).json({ message: "Not authorized, please login to access this route." })

    if (!JWT_SECRET) return res.status(500).json({ message: "No JWT_SECRET FOUND! Please add to ENV file." })

    const token = req.headers.authorization.split(" ")[1];

    try {
        const decodedUser = jwt.verify(token!, JWT_SECRET)
        console.log(decodedUser)
        req.user = decodedUser;
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "Not authorized!" })
    }
}