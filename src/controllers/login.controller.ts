import type { Request, Response } from "express";
import prisma from "../PrismaClient/prismaClient.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;


export class LoginController {

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!JWT_SECRET) return res.status(400).json({mesage: "No JWT_SECRET FOUND! Please add to ENV file."})
        try {
            const user = await prisma.user.findFirst({
                where: {
                    email
                }
            })
            if (!user) {
                res.status(404).json({ message: "Incorrect email" });
            } else if (await bcrypt.compare(password, user.password)) {
                //user signed in with correct details
                //(email: "admin@mail.com", password: "admin" for admin)
                //(email: "member@mail.com", password: "member" for member)
                console.log("user logged in");
                const token = jwt.sign({id: user.id, role: user.role}, JWT_SECRET, {expiresIn: "3h"});
                res.status(200).json({token})
            } else {
                return res.status(401).json({ message: "Wrong password" })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal server error", error });
        }
    }
}

export const loginController = new LoginController()