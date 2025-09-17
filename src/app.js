import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


//Handling CORS - Cross Origin Resource Sharing
app.use(cors({
    origin : process.env.CORS_ORIGIN || "*",
    credentials : true
}));

//Handling data that comes in json format
app.use(express.json({
    limit : "16kb",
}))


//Handling data taht comes from url
app.use(express.urlencoded({
    extended : true,
    limit : "16kb"
}))


//Handling static files
app.use(express.static("public"));

//Managing cookies
app.use(cookieParser());


//routes import 

import userRouter from './routes/user.routes.js'

 
//routes declaration

app.use("/api/v1/users", userRouter);



export { app }