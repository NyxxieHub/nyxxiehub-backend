import express from "express";
import { config } from "dotenv";
config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor rodando! 🚀");
});

app.listen(3000, () => {
  console.log("Server on http://localhost:3000");
});
