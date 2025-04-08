import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { authRoute } from "./routes/authRoute.js";

const app = express();

const PORT = process.env.PORT || 3000;

await mongoose
  .connect(process.env.DB_MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(cors({}));

app.use(authRoute);

app.get("/", (req, res) => {
  res.send("Welcome to Spider Squad shopping list app");
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
