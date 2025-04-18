import axios from "axios";

const API = axios.create({
    baseURL : process.env.REACT_APP_API_URL,
})

export const UserSignUp = async(data) => API.post("/user/signup",data);
export const UserSignIn = async(data) => API.post("/user/signin",data);

export const getDashboardDetails = async(token) => await API.get("/user/dashboard",{
    headers : {Authorization : `Bearer ${token}`}
});

export const getWorkouts = async (token, date) => {
    
    const queryParam = date ? `?date=${date}` : "";
    return await API.get(`/user/workouts${queryParam}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const postWorkout = async(token,data) => await API.post("/user/workouts",data,{
    headers : {Authorization : `Bearer ${token}`}
});

export const deleteWorkout = async(token,id) => await API.delete(`/user/dashboard/${id}`,{
    headers : {Authorization : `Bearer ${token}`}
});

export const getProfile = async(token) => await API.get("/user/profile",{
    headers : {Authorization : `Bearer ${token}`}
});