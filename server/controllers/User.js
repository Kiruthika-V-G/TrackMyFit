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
    return next(error);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

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
    return next(error);
  }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const currentDateFormatted = new Date();
    const startToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate()
    );
    const endToday = new Date(
      currentDateFormatted.getFullYear(),
      currentDateFormatted.getMonth(),
      currentDateFormatted.getDate() + 1
    );

    //calculte total calories burnt
    const totalCaloriesBurnt = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: null,
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    //Calculate total no of workouts
    const totalWorkouts = await Workout.countDocuments({
      user: userId,
      date: { $gte: startToday, $lt: endToday },
    });

    //Calculate average calories burnt per workout
    const avgCaloriesBurntPerWorkout =
      totalCaloriesBurnt.length > 0
        ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
        : 0;

    // Fetch category of workouts
    const categoryCalories = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      {
        $group: {
          _id: "$category",
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    //Format category data for pie chart

    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));

    const weeks = [];
    const caloriesBurnt = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000
      );
      weeks.push(`${date.getDate()}th`);

      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );

      const weekData = await Workout.aggregate([
        {
          $match: {
            user: user._id,
            date: { $gte: startOfDay, $lt: endOfDay },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            totalCaloriesBurnt: { $sum: "$caloriesBurned" },
          },
        },
        {
          $sort: { _id: 1 }, // Sort by date in ascending order
        },
      ]);

      caloriesBurnt.push(
        weekData[0]?.totalCaloriesBurnt ? weekData[0]?.totalCaloriesBurnt : 0
      );
    }

    return res.status(200).json({
      totalCaloriesBurnt:
        totalCaloriesBurnt.length > 0
          ? totalCaloriesBurnt[0].totalCaloriesBurnt
          : 0,
      totalWorkouts: totalWorkouts,
      avgCaloriesBurntPerWorkout: avgCaloriesBurntPerWorkout,
      totalWeeksCaloriesBurnt: {
        weeks: weeks,
        caloriesBurned: caloriesBurnt,
      },
      pieChartData: pieChartData,
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

    const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Reset to the start of the day
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // End of the day

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



export const addWorkout = async (req, res, next) => {
  try {
    const { workoutStr } = req.body;
    const userId = req.user.id;

    if (!workoutStr || workoutStr.trim() === "") {
      return next(createError(400, "Workout input is empty!"));
    }

    const workoutLines = workoutStr
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean); // remove empty lines

    const parsedWorkout = [];

    for (let i = 0; i < workoutLines.length; i += 5) {
      const block = workoutLines.slice(i, i + 5);

      if (block.length < 5 || !block[0].startsWith("#")) {
        return next(
          createError(400, `Invalid workout format at block starting with line: "${block[0]}"`)
        );
      }

      const category = block[0].substring(1).trim();
      const workoutName = block[1];

      const [setsStr, repsStr] = block[2]
        .toLowerCase()
        .replace(/\s/g, "")
        .split("x");

      const sets = parseInt(setsStr);
      const reps = parseInt(repsStr);
      const weight = parseInt(block[3]);
      const duration = parseInt(block[4]);

      if (
        isNaN(sets) ||
        isNaN(reps) ||
        isNaN(weight) ||
        isNaN(duration)
      ) {
        return next(
          createError(400, `Invalid number in workout block starting with "${block[0]}"`)
        );
      }

      const caloriesBurned = sets * reps * weight * 0.1; // You can update this formula as needed

      parsedWorkout.push({
        user: userId,
        category,
        workoutName,
        sets,
        reps,
        weight,
        duration,
        caloriesBurned,
        date: new Date(),
      });
    }

    await Workout.insertMany(parsedWorkout);
    res.status(200).json({ message: "Workouts added successfully!" });

  } catch (err) {
    next(err);
  }
};

export const deleteWorkouts = async(req,res,next) => {
  try{
    const {id} = req.params;
    const result = await Workout.deleteOne({_id : id});

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
