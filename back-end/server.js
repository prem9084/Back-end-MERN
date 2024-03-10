import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDb } from "./db/db.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";

const app = express();
dotenv.config();

connectDb();
// middlewares
app.use(express.json());
app.use(morgan("dev"));

// routers
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
