import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import {MONGO_URI, PORT} from "./app/config/config.js";


const app = express();

app.use(bodyParser.json({limit:"100mb", extended: true}));
app.use(bodyParser.urlencoded({limit:"100mb", extended: true}));
app.use(cors());




mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);



