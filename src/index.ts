import express from "express"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express";
import fs from "fs";

import userRoutes from "./routes/user.routes.js"
import taskRoutes from "./routes/task.routes.js"

dotenv.config()
const PORT = process.env.PORT || 3000;
const app = express();

const openApiSpec = JSON.parse(fs.readFileSync("./openapi.json", "utf-8"));

app.use(express.json());
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})