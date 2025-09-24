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
            Array.from({ length: 10 }).map(async () => ({
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

        const todos = [
            "Handla mat",
            "Tvätta kläder",
            "Dammsuga vardagsrummet",
            "Vattna blommorna",
            "Betala räkningar",
            "Ringa mamma",
            "Planera middagen",
            "Skriva inköpslista",
            "Gå till gymmet",
            "Boka tandläkartid",
            "Sortera återvinningen",
            "Diska",
            "Städa badrummet",
            "Skriva klart rapporten",
            "Packa väskan",
            "Skicka mejl till chefen",
            "Hämta paket",
            "Tvätta bilen",
            "Planera helgen",
            "Köpa present"
        ]
        const taskData = todos.map((item) => ({
            title: item,
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