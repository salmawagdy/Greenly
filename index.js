import bootstrap from "./src/app.controller.js";
import express from "express";
import cors from "cors";
import * as dotenv from 'dotenv'
import path from 'node:path'
dotenv.config({path:path.resolve('./src/config/.env.dev')})
//import bodyParser from "body-parser";
//import mongoose from "mongoose";

const app = express();
const port = process.env.PORT||5000;

app.use(cors());
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

bootstrap(app, express);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

