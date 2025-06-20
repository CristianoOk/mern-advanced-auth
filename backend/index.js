import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import cors from "cors"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({origin: "http://localhost:5173", credentials: true}));

app.use(express.json());  //allows us to parse incoming requests:req.body.
app.use(cookieParser()); //allows us to parse incoming cookies. Estoy diciendo a Express que analice (parsee) las cookies que vienen en la solicitud y las convierta en un objeto útil para que pueda acceder a ellas desde req.cookies. De otra forma sería como una foto, con esto puedo trabajar/extraer lo que guarda.

app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
})


