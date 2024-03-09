import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { router as movies } from "./api/movies";
import { router as person } from "./api/person";
import { router as star } from "./api/star";
import { router as creator } from "./api/creator";
import { router as search } from "./api/search";

export const app = express();
app.use(
  cors({
    origin: "*",
  })
);


app.use(bodyParser.text());
app.use(bodyParser.json());

// app.use("/", (req, res) => {
//   res.send("Sawad dee kub");
// });




app.use("/movies", movies);
app.use("/person", person);
app.use("/star", star);
app.use("/creator", creator);
app.use("/search", search);
