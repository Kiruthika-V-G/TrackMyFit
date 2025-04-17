import express from "express";
import { UserLogin, UserRegister, getUserDashboard, getWorkoutsByDate, addWorkout ,deleteWorkouts,getProfile} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup",UserRegister);
router.post("/signin",UserLogin);
router.get("/dashboard", verifyToken, getUserDashboard );
router.delete("/dashboard/:id",verifyToken,deleteWorkouts);
router.get("/workouts", verifyToken, getWorkoutsByDate);
router.post("/workouts", verifyToken, addWorkout);
router.get("/profile", verifyToken, getProfile);


export default router;