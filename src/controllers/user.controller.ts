import type { Request, Response } from "express";
import prisma from "../PrismaClient/prismaClient.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv"
dotenv.config()

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) | 10;

export class UserController {
    //CREATE USER
    async createUser(req: Request, res: Response) {
        const { name, email, password } = req.body;

        try {
            const hashedPW = await bcrypt.hash(password, SALT_ROUNDS);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPW
                },
                omit: {
                    password: true
                }
            });

            console.log(user);
            res.status(201).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({error});
        }
    };

    //GET USER
    async getUser(req: Request, res: Response) {
        const {id} = req.params;

        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: Number(id)
                },
                //omitting password
                omit: {
                    password: true
                }
            });

            console.log(user);
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({error});
        }
    };


    //GET ALL USERS
    async getAll(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany({
                omit: {
                    password: true
                }
            });

            console.log(users);
            res.status(200).json(users)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    //UPDATE USER
    async updateUser(req: Request, res: Response) {
        const {id} = req.params;
        //optional patch, only updates fields which is in req.body
        const {...newData} = req.body;
        
        try {
            //hasing new password if it is included in the req.body
            if (req.body.password) {
                newData.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
            }
            const user = await prisma.user.update({
                where: {
                    id: Number(id)
                },
                data: newData,
                omit: {
                    password: true
                }
            })

            res.status(200).json(user)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    //DELETE USER
    async deleteUser(req: Request, res: Response) {
        const {id} = req.params;

        try {
            const user = await prisma.user.delete({
                where: {
                    id: Number(id)
                },
                omit: {
                    password: true
                }
            })
            res.status(209).json(user)
        } catch (error) {
            console.log(error);
            res.status(500).json(error)
        }
    }
};

export const userController = new UserController()