import React, { useEffect, useState } from 'react'
import styled from "styled-components"
import { counts } from '../utils/data';
import CountsCard from '../components/cards/CountsCard';
import WeeklyStatCard from '../components/cards/WeeklyStatCard';
import CategoryCard from '../components/cards/CategoryCard';
import AddWorkout from '../components/AddWorkout';
import WorkoutCard from '../components/cards/WorkoutCard';
import { getDashboardDetails,getWorkouts,postWorkout,deleteWorkout as deleteWorkoutAPI } from '../api';
import dayjs from 'dayjs';

const Container = styled.div`
    display : flex;
    flex : 1;
    height : 100%;
    justify-content : center;
    padding : 20px 0;
    
`;
const Wrapper = styled.div`
    flex-direction : column;
    max-width : 1400px;
    flex:1;
    display : flex;
    gap : 22px;

    @media (max-width : 768px){
        gap : 12px;
    }
`;
const Title = styled.div`
    padding : 0 16px;
    font-size : 22px;
    color : ${({theme}) => theme.text_primary};
    font-weight : 500;
`;
const FlexWrap = styled.div`
    display : flex;
    flex-wrap : wrap;
    justify-content : space-between;
    gap : 22px;
    padding : 0 16px;
    @media (max-width : 768px){
        gap : 12px;
    }
`;

const Section = styled.div`
    display : flex;
    flex-direction : column;
    padding : 0 16px;
    gap : 20px;
    @media(max-width : 768px){
        gap : 12px;
    }
`;

const CardWrapper = styled.div`
    display : flex;
    flex-wrap : wrap;
    justify-content : center;
    gap : 22px;
    margin-bottom : 90px;
    @media (max-width : 600px){
        gap : 12px;
    }
`;


const Dashboard = () => {

  const [loading,setLoading] = useState(false);
  const [buttonLoading,setButtonLoading] = useState(false);
  const [data, setData] = useState();
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [workout,setWorkout] = useState(`#Legs
Back Squat
5 setsX15 reps
30 kg
10 min
`)

    const dashboardData = async() => {
        setLoading(true);
        const token = localStorage.getItem("trackmyfit-app-token");
        await getDashboardDetails(token)
            .then((res)=> {
                setData(res.data);
                console.log(data);
                setLoading(false);
            })        
            .catch((e)=> {
                alert("dashboard : "+e);
            })
    }

    const getTodaysWorkout = async () => {
        setLoading(true);
        const token = localStorage.getItem("trackmyfit-app-token");
        const today = dayjs().format("YYYY-MM-DD"); 
        await getWorkouts(token, today)
          .then((res) => {
            setTodaysWorkouts(res?.data?.todayWorkout || []);
            setLoading(false);
          })
          .catch((e) => {
            setTodaysWorkouts([]);
          });
      };
      

    

    const addNewWorkout = async() => {
        setButtonLoading(true);
        const token = localStorage.getItem("trackmyfit-app-token");
        await postWorkout(token,{workoutStr : workout})
            .then((res)=> {
                dashboardData();
                getTodaysWorkout();
                console.log(data);
                setButtonLoading(false);
            })
            .catch((e)=> {
                alert("add new workout : "+e);
            })
    }

    const deleteWorkout = async(id) => {
        const token = localStorage.getItem("trackmyfit-app-token");
        try {
            
            await deleteWorkoutAPI(token, id);
            setTodaysWorkouts(prev => prev.filter(workout => workout._id !== id));
        } catch (error) {
            alert("delete workout: " + error);
  }
    }

    useEffect(() => {
        dashboardData();
        getTodaysWorkout();
    },[]) // to stay in dasboard page after reload
  return (
    <Container>
        <Wrapper>
            <Title>Dashboard</Title>
            <FlexWrap>
                {
                    counts.map((item) => (
                        <CountsCard item={item} data={data}/>
                    ))
                }
            </FlexWrap>
            <FlexWrap>
                <WeeklyStatCard data={data}/>
                <CategoryCard data={data}/>
                <AddWorkout workout={workout} setWorkout={setWorkout} addNewWorkout={addNewWorkout} buttonLoading={buttonLoading}/>
            </FlexWrap>

            <Section>
                <Title>Today's Workout</Title>
                <CardWrapper>
                    {
                        todaysWorkouts.map((workout) => (
                            <WorkoutCard key={workout._id}
                            workout={workout} 
                            deleteWorkout={deleteWorkout} 
                             />
                        ))
                    }
                </CardWrapper>
            </Section>
        </Wrapper>
    </Container>
  )
}

export default Dashboard
