import type { Request, Response } from "express";
import prisma from "../PrismaClient/prismaClient.js";

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
            res.status(500).json({error});
        }
    };

    //GET TASK
    // async getTask(req: Request, res: Response) {
    //     const {id} = req.params;

    //     try {
    //         const task = await prisma.task.findFirst({
    //             where: {
    //                 id: Number(id)
    //             },
    //             //omitting password
    //             omit: {
    //                 password: true
    //             }
    //         });

    //         console.log(task);
    //         res.status(200).json(task);
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({error});
    //     }
    // };


    // //GET ALL TASKS
    // async getAll(req: Request, res: Response) {
    //     try {
    //         const tasks = await prisma.task.findMany({
    //             omit: {
    //                 password: true
    //             }
    //         });

    //         console.log(tasks);
    //         res.status(200).json(tasks)
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json(error)
    //     }
    // }

    // //UPDATE TASK
    // async updateTask(req: Request, res: Response) {
    //     const {id} = req.params;
    //     //optional patch, only updates fields which is in req.body
    //     const {...newData} = req.body;
        
    //     try {
    //         //hasing new password if it is included in the req.body
    //         if (req.body.password) {
    //             newData.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    //         }
    //         const task = await prisma.task.update({
    //             where: {
    //                 id: Number(id)
    //             },
    //             data: newData,
    //             omit: {
    //                 password: true
    //             }
    //         })

    //         res.status(200).json(task)
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json(error)
    //     }
    // }

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