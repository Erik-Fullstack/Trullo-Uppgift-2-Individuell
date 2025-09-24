import type { Request, Response } from "express";
import prisma from "../PrismaClient/prismaClient.js";
import { Prisma } from "../generated/prisma/index.js";

export class TaskController {
    //CREATE TASK
    async createTask(req: Request, res: Response) {
        const { assignedTo, ...newData } = req.body;

        try {
            if (assignedTo) {
                //if assignedTo is included in the req, connect it with the user
                const task = await prisma.task.create({
                    data: {
                        ...newData,
                        user: { connect: { id: assignedTo } }
                    }
                })
                //Prisma kastar ett error ifall usern man försöker assigna till inte finns i databasen (error.code P2025)
                res.status(201).json({ data: task })
            } else {
                const task = await prisma.task.create({
                    data: newData
                });
                res.status(201).json({ data: task })
            }
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                res.status(404).json(error.meta)
            } else if (error instanceof Prisma.PrismaClientValidationError) {
                res.status(400).json({ message: "Invalid data input", error })
            } else {
                res.status(500).json({ error: "Internal server error" })
            }
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
            if (task === null) {
                return res.status(404).json({ error: `No task with id: ${id} exists in DB.` })
            }
            res.status(200).json({ data: task });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    };


    // //GET ALL TASKS
    async getAll(req: Request, res: Response) {
        try {
            const tasks = await prisma.task.findMany({
            });
            //No tasks found
            if (tasks.length === 0) {
                return res.status(200).json({ message: "No users exists in DB." })
            }
            res.status(200).json({ data: tasks })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal server error" })
        }
    }

    // //UPDATE TASK
    async updateTask(req: Request, res: Response) {
        const { id } = req.params;
        //optional patch, only updates fields which is in req.body
        const { assignedTo, ...newData } = req.body;
        try {
            if (newData.status === "DONE") newData.finishedAt = new Date();
            if (assignedTo) {
                //if assignedTo is included in the req, update it and connect it with a user
                const task = await prisma.task.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        ...newData,
                        user: { connect: { id: assignedTo } }
                    }
                })
                //Prisma kastar ett error ifall usern inte finns i databasen (error.code P2025)
                res.status(200).json({ data: task })
            } else {
                const task = await prisma.task.update({
                    where: {
                        id: Number(id)
                    },
                    data: newData
                })
                res.status(200).json({ data: task })
            }
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

    //DELETE TASK
    async deleteTask(req: Request, res: Response) {
        const { id } = req.params;
        //om en user som har en task assignad raderas så sätts tasken till NULL igen
        try {
            const task = await prisma.task.delete({
                where: {                            
                    id: Number(id)
                }
            })
            res.status(200).json({ data: task })
        } catch (error) {
            console.log(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                res.status(404).json(error.meta)
            } else {
                res.status(500).json({ error: "Internal server error" })
            }
        }
    }

    //ASSIGN TASK
    async assignTaskToUser(req: Request, res: Response) {
        const { taskId } = req.params;
        const { userId } = req.body;

        if (!userId) return res.status(400).json({error: "Please enter a user to assign the task to."})
        try {
            const assignedTask = await prisma.task.update({
                where: {
                    id: Number(taskId)
                },
                data: {
                    user: { connect: { id: userId } }
                }
            })
            res.status(200).json({ data: assignedTask })
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
};

export const taskController = new TaskController()