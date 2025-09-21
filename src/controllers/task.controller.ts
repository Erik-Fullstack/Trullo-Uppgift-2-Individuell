import type { Request, Response } from "express";
import prisma from "../PrismaClient/prismaClient.js";
import { Prisma } from "../generated/prisma/index.js";

export class TaskController {
    //CREATE TASK
    async createTask(req: Request, res: Response) {
        const { title, description } = req.body;

        try {

            const task = await prisma.task.create({
                data: {
                    title,
                    description,
                }
            });

            console.log(task);
            res.status(201).json(task);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    };

    //GET TASK
    async getTask(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const task = await prisma.task.findFirst({
                where: {
                    id: Number(id)
                }
            });

            console.log(task);
            res.status(200).json(task);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    };


    // //GET ALL TASKS
    async getAll(req: Request, res: Response) {
        try {
            const tasks = await prisma.task.findMany({
            });

            console.log(tasks);
            res.status(200).json(tasks)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    // //UPDATE TASK
    async updateTask(req: Request, res: Response) {
        const { id } = req.params;
        //optional patch, only updates fields which is in req.body
        const { assignedTo, ...newData } = req.body;

        try {
            // if (newData.status && newData.status === "DONE") {
            //     newData.finishedAt = new Date()
            // }
            // if (newData.assignedTo) {
            //     const user = await prisma.user.findFirst({
            //         where: {
            //             id: newData.assignedTo
            //         }
            //     })
            //     if (user) {
            //         const task = await prisma.task.update({
            //             where: {
            //                 id: Number(id)
            //             },
            //             data: newData
            //         })
            //         return res.status(200).json(task)
            //     }
            // }
            if (assignedTo) {
                const task = await prisma.task.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        ...newData,
                        user: { connect: { id: assignedTo } }
                    }
                })
                return res.status(200).json(task)
            }
            const task = await prisma.task.update({
                where: {
                    id: Number(id)
                },
                data: { ...newData }
            })
            
            res.status(200).json(task)
            //fixa error med type, funktionen funkar
        } catch (error) {
            console.log(error)
            if (error.code === "P2025") {
                res.status(404).json({error: error.meta.cause})
            } else {
                res.status(500).json(error)
            }
        }
    }

    // //DELETE TASK
    // async deleteTask(req: Request, res: Response) {
    //     const {id} = req.params;

    //     try {
    //         const task = await prisma.task.delete({
    //             where: {
    //                 id: Number(id)
    //             },
    //             omit: {
    //                 password: true
    //             }
    //         })
    //         res.status(209).json(task)
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json(error)
    //     }
    // }
};

export const taskController = new TaskController()