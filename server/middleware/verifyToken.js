import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import User from "../models/User.js";

export const verifyToken = async(req,res,next) => {
    try{
        if (!req.headers.authorization){
            return next(createError(401,"You are not authenticated!"));
        }

        const token = req.headers.authorization.split(" ")[1];

        if(!token){
            return next(createError(401,"You are not authenticated!"));
        }

        const decode = jwt.decode(token,process.env.JWT);
        req.user = decode; //decode and get user id and passed to controller/user.js
        return next();
    }catch(e){
        next(e);
    }
};


