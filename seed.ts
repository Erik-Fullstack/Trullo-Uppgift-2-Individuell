import dotenv from "dotenv"
import prisma from "./src/PrismaClient/prismaClient.js";
import { faker } from "@faker-js/faker"
import bcrypt from "bcrypt"

dotenv.config()
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) | 10;

async function seedDB() {
    try {
        await prisma.user.deleteMany()
        await prisma.task.deleteMany()

        console.log("Cleared old data from DB")

        //generates 5 random users
        const userData = await Promise.all(
            Array.from({ length: 5 }).map(async () => ({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: await bcrypt.hash(faker.lorem.word({ length: { min: 5, max: 10 }, strategy: "closest" }), SALT_ROUNDS)
            }))
        );

        //adds the users to users table
        await prisma.user.createMany({
            data: userData
        })
        console.log(`Added ${userData.length} users.`)

        const taskData = Array.from({ length: 10 }).map(() => ({
            title: `Visit: ${faker.location.country()}`,
            description: faker.lorem.sentence({ min: 3, max: 6 })
        }))

        await prisma.task.createMany({
            data: taskData
        })
        console.log(`Added ${taskData.length} tasks.`)

        console.log("Seeding completed!")

        // Close the Prisma connection
        await prisma.$disconnect()
    } catch (error) {
        console.log(error)
        await prisma.$disconnect()
        process.exit(1)
    }
}

seedDB()