import express from "express"
import cors  from "cors";

import authRoute from "../controller/auth/auth.js"
import gameRoute from "../controller/game/game.js"
const app = express();
app.use(cors());

app.use("/auth",authRoute)
app.use("/game",gameRoute)

export default app