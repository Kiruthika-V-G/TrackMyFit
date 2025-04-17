import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose, { connect } from "mongoose";
import UserRoutes from "./routes/User.js";

dotenv.config(); // part of dotenv used to load enviroment var from .env to process.env. it reads key value pairs from .env and add them to process.env making them accessible throughout project
// if .env is not in root then specify path inside config function

const app = express();

app.use(cors()); //MW, cors handle req from diff origins or ports hosted in diff domain
// it auto. adds http req to allow cross origin req and enables cors for all routes

app.use(express.json({limit : "50mb"})) //MW parses icnoming json req from post method and sets the max size of json payload to 50mb
app.use(express.urlencoded({extended : true}));  //MW parses inc req with url encoded payloads like form data and extended true allows complex obj and arrays in parsed data which uses qs lib


app.use("/api/user",UserRoutes); // userroutes alias for routes/user.js routes

//error handler

app.use((err,req,res,next) => {
  const status = err.status || 500;
  const msg =  err.message || "Something went wrong";
  return res.status(status).json({
    success : false,
    status,
    msg,
  });
});

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to Mongo DB");
  } catch (e) {
    console.error("MongoDB connection error:", e.message);
    process.exit(1);
  }
};

const server = async() => {
    try{
        connectDB();
        app.listen(8080, () => console.log("server running on port 8080"));
    } catch(e){
        console.log(e);
    }
}

server();