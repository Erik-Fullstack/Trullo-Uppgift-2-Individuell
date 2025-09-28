import type { Request, Response } from "express";
import prisma from "../PrismaClient/prismaClient.js";
import { Prisma } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv"
import z from "zod"

dotenv.config()

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(5)
}).strict();
const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    password: z.string().min(5).optional()
}).strict();

export class UserController {
    //CREATE USER
    async createUser(req: Request, res: Response) {
        const parsed = createUserSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ message: "Invalid data input", error: parsed.error.issues })

        const { password, ...data } = req.body;

        if (!password) return res.status(400).json({ message: "Password required" })

        try {
            const hashedPW = await bcrypt.hash(password, SALT_ROUNDS);

            const user = await prisma.user.create({
                data: {
                    ...data,
                    password: hashedPW
                },
                omit: {
                    password: true
                }
            });
            res.status(201).json({ data: user });
        } catch (error) {
            console.log(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                res.status(409).json({ message: "Email is already in use.", prismaErrorCode: error.code, error: error.meta })
            } else if (error instanceof Prisma.PrismaClientValidationError) {
                res.status(400).json({ message: "Invalid data input", error })
            } else {
                res.status(500).json({ message: "Internal server error", error });
            }
        }
    };

    //GET USER (with their tasks)
    async getUser(req: Request, res: Response) {
        const { id } = req.params;
        const { tasks } = req.query;

        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: Number(id)
                },
                //omitting password
                omit: {
                    password: true
                },
                include: {
                    tasks: (tasks ? true : false)
                }
            });
            if (user === null) {
                return res.status(404).json({ error: `No user with id: ${id} exists in DB.` })
            }
            res.status(200).json({ data: user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    };


    //GET ALL USERS
    async getAll(req: Request, res: Response) {
        const { tasks } = req.query;

        try {
            const users = await prisma.user.findMany({
                omit: {
                    password: true
                },
                include: {
                    tasks: (tasks === "true" ? true : false)
                }
            });
            if (users.length === 0) {
                return res.status(200).json({ message: "No users exists in DB." })
            }
            res.status(200).json({ data: users })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal server error" })
        }
    }

    //UPDATE USER
    async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const parsed = updateUserSchema.safeParse(req.body);
        if (!parsed.success) return res.status(400).json({ message: "Invalid data input", error: parsed.error.issues })
        //optional patch, only updates fields which is in req.body
        const { password, ...newData } = req.body;
        if (Object.keys(newData).length === 0) return res.status(400).json({ message: "At least 1 field required to update" })

        try {
            //hasing new password if it is included in the req.body
            if (password) {
                newData.password = await bcrypt.hash(password, SALT_ROUNDS);
            }
            const user = await prisma.user.update({
                where: {
                    id: Number(id)
                },
                data: {
                    ...newData
                },
                omit: {
                    password: true
                }
            })

            res.status(200).json({ data: user })
        } catch (error) {
            console.log(error)
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                res.status(404).json(error.meta)
            } else if (error instanceof Prisma.PrismaClientValidationError) {
                res.status(400).json({ message: "Invalid data input", error })
            } else {
                res.status(500).json({ error: "Internal server error" })
            }
        }
    }

    //DELETE USER 
    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        const userId = req.user.id
        const userRole = req.user.role

        try {
            if (userRole === "ADMIN") {
                const user = await prisma.user.delete({
                    where: {
                        id: Number(id)
                    },
                    omit: {
                        password: true
                    }
                })
                res.status(200).json({ data: user })
            } else if (userId === Number(id)) {
                const user = await prisma.user.delete({
                    where: {
                        id: Number(id)
                    },
                    omit: {
                        password: true
                    }
                })
                res.status(200).json({ data: user })
            } else {
                res.status(401).json({ message: "Only admins can delete anyone, members can only delete themselves!"})
            }
        } catch (error) {
            console.log(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                res.status(404).json(error.meta)
            } else {
                res.status(500).json({ error: "Internal server error" })
            }
        }
    }
};

export const userController = new UserController()