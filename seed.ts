import dotenv from "dotenv";
import prisma from "./src/PrismaClient/prismaClient.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { Status } from "./src/generated/prisma/index.js";
import { Role } from "./src/generated/prisma/index.js";

dotenv.config();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

async function seedDB() {
    try {
        await prisma.user.deleteMany()
        await prisma.task.deleteMany()

        console.log("Cleared old data from DB")

        //generates 10 random users
        const userData = await Promise.all(
            Array.from({ length: 10 }).map(async () => {
                const firstName = faker.person.firstName()
                const lastName = faker.person.lastName()
                return {
                    name: firstName + " " + lastName,
                    email: faker.internet.email({ firstName, lastName }),
                    password: await bcrypt.hash(faker.lorem.word({ length: { min: 5, max: 20 }, strategy: "closest" }), SALT_ROUNDS)
                }
            })
        );

        //adds the users to users table
        await prisma.user.createMany({
            data: userData
        })

        await prisma.user.create({
            data: {
                name: "member",
                email: "member@mail.com",
                password: await bcrypt.hash("member", SALT_ROUNDS),
                role: Role.MEMBER
            }

        })
        await prisma.user.create({
            data: {
                name: "admin",
                email: "admin@mail.com",
                password: await bcrypt.hash("admin", SALT_ROUNDS),
                role: Role.ADMIN
            }

        })
        console.log(`Added ${userData.length} users + 1 admin and 1 member with hard coded login credentials for testing purposes.`)
        console.log('Admin: {name: "admin", email: "admin@mail.com", password: "admin"}.')
        console.log('Member: {name: "member", email: "member@mail.com", password: "member"}.')

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
        const statusValues = Object.values(Status);
        //generates 20 random tasks from todo array
        const taskData = todos.map((item) => {
            const status = statusValues[Math.floor(Math.random() * statusValues.length)];
            return {
                title: item,
                description: faker.lorem.sentence({ min: 3, max: 6 }),
                status: status,
                ...(status === Status.DONE ? { finishedAt: new Date() } : {})
            };
        });
        //adds tasks to DB
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