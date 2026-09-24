import express from "express";
import postRouter from "./routers/post.js";


const app = express();
app.use(express.json());
app.use(postRouter);

const HOST = "localhost";
const PORT = 8000;

app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}`);
});