import express from "express"
import dotenv from "dotenv"

import userRoutes from "./routes/user.routes.js"
import taskRoutes from "./routes/task.routes.js"

dotenv.config()
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})