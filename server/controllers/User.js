import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";

dotenv.config();

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;
    console.log("Signup request body:", req.body);
    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {

      return next(createError(409, "Email is already in use."));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
    });
    const createdUser = await user.save();
    const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Signup error:", error);
    return next(error);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Signin request body:", req.body);
    
    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
      return next(createError(404, "User not found"));
    }
    console.log(user);
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });

    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Siginin error : ",error)
    return next(error);
  }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found"));

    const now = new Date();
    const startToday = new Date(now.setHours(0, 0, 0, 0));
    const endToday = new Date(now.setHours(23, 59, 59, 999));

    const totalCaloriesBurnt = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      { $group: { _id: null, totalCaloriesBurnt: { $sum: "$caloriesBurned" } } },
    ]);

    const totalWorkouts = await Workout.countDocuments({
      user: userId,
      date: { $gte: startToday, $lt: endToday },
    });

    const avgCaloriesBurntPerWorkout =
      totalCaloriesBurnt.length > 0
        ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
        : 0;

    const categoryCalories = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      { $group: { _id: "$category", totalCaloriesBurnt: { $sum: "$caloriesBurned" } } },
    ]);

    const pieChartData = categoryCalories.map((category,index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));
    

    const weeks = [];
    const caloriesBurnt = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      weeks.push(`${date.getDate()}th`);

      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const weekData = await Workout.aggregate([
        { $match: { user: user._id, date: { $gte: startOfDay, $lt: endOfDay } } },
        { $group: { _id: null, totalCaloriesBurnt: { $sum: "$caloriesBurned" } } },
      ]);

      caloriesBurnt.push(weekData[0]?.totalCaloriesBurnt || 0);
    }

    return res.status(200).json({
      totalCaloriesBurnt:  totalCaloriesBurnt.length > 0
      ? totalCaloriesBurnt[0].totalCaloriesBurnt
      : 0,
      totalWorkouts,
      avgCaloriesBurntPerWorkout,
      totalWeeksCaloriesBurnt: { weeks, caloriesBurned: caloriesBurnt },
      pieChartData,
    });
  } catch (err) {
    next(err);
  }
};



export const getWorkoutsByDate = async (req, res, next) => {
  console.log('Request received for workouts by date');
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    let date = req.query.date ? new Date(req.query.date) : new Date();
    console.log("Query date:", date);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);


    // Fix: Check for 'user' field instead of 'userId'
    const todayWorkout = await Workout.find({
      user: userId, 
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (!todayWorkout || todayWorkout.length === 0) {
      return res.status(404).json({ message: "No workouts found for the given date." });
    }

    const totalCaloriesBurnt = todayWorkout.reduce(
      (total, workout) => total + workout.caloriesBurned,
      0
    );

    return res.status(200).json({ todayWorkout, totalCaloriesBurnt });

  } catch (e) {
    next(e);
  }
};


export const deleteWorkouts = async(req,res,next) => {
  try{
    const {id} = req.params;
    const result = await Workout.deleteOne({ _id: id, user: req.user.id });

    if(result.deletedCount===0){
      return res.status(404).json({message : "workout not found"})
    }
    res.status(200).json({message : "workout deleted"})
  }catch(err){
    next(err);
  }
}

export const getProfile = async(req,res,next) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

export const addWorkout = async (req, res, next) => {
  try {
    const { workoutStr } = req.body;
    const userId = req.user.id;

    if (!workoutStr || workoutStr.trim() === "") {
      return next(createError(400, "Workout input is empty!"));
    }

    // Normalize input: remove extra newlines and trim
    const normalizedInput = workoutStr.replace(/\n\s*\n/g, '\n').trim();
    console.log('Received workoutStr:', normalizedInput); // Debug log

    const workoutLines = normalizedInput
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    if (workoutLines.length !== 5) {
      return next(createError(400, `Workout must have exactly 5 lines: #Category, Name, SetsXReps, Weight, Duration. Received ${workoutLines.length} lines.`));
    }

    const [categoryLine, workoutName, setsReps, weightStr, durationStr] = workoutLines;

    if (!categoryLine.startsWith("#")) {
      return next(createError(400, "Category must start with # (e.g., #Legs)."));
    }

    const category = categoryLine.substring(1).trim();
    if (!category) {
      return next(createError(400, "Category cannot be empty."));
    }

    if (!workoutName.trim()) {
      return next(createError(400, "Workout name cannot be empty."));
    }

    const setsRepsMatch = setsReps.match(/^(\d+)\s*sets\s*[xX]\s*(\d+)\s*reps$/i);
    if (!setsRepsMatch) {
      return next(createError(400, `Sets and reps must be in format 'SetsXReps' (e.g., 5 setsX15 reps). Received: "${setsReps}"`));
    }
    const sets = parseInt(setsRepsMatch[1]);
    const reps = parseInt(setsRepsMatch[2]);

    const weightMatch = weightStr.match(/^(\d+)\s*kg$/);
    if (!weightMatch) {
      return next(createError(400, `Weight must be a number followed by 'kg' (e.g., 30 kg). Received: "${weightStr}"`));
    }
    const weight = parseInt(weightMatch[1]);

    const durationMatch = durationStr.match(/^(\d+)\s*min$/);
    if (!durationMatch) {
      return next(createError(400, `Duration must be a number followed by 'min' (e.g., 10 min). Received: "${durationStr}"`));
    }
    const duration = parseInt(durationMatch[1]);

    const caloriesBurned = sets * reps * weight * 0.1;

    const workout = {
      user: userId,
      category,
      workoutName,
      sets,
      reps,
      weight,
      duration,
      caloriesBurned,
      date: new Date(),
    };

    await Workout.create(workout);
    res.status(200).json({ message: "Workout added successfully!" });
  } catch (err) {
    console.error('Add workout error:', err); // Debug log
    next(err);
  }
};
