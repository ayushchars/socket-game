import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import route from "./routes/index.js";
import cors from "cors";
import { createServer } from "http";
import initSocket from "./socket.js"; 

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", route);

const server = createServer(app);

initSocket(server); 

const PORT = process.env.PORT ;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send(`<h1>Server is running on port ${PORT}</h1>`);
});
