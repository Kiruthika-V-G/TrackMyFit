import { FitnessCenterRounded, TimelapseRounded } from '@mui/icons-material';
import React from 'react'
import styled from 'styled-components'
import Button from '../Button';

const Card = styled.div`
  display : flex;
  flex : 1;
  flex-direction : row;
  min-width : 250px;
  max-width : 400px;
  padding : 16px 18px;
  border : 1px solid ${({theme})=>theme.text_primary};
  border-radius : 10px;
  box-shadow : 1px 2px 15px 0 ${({theme})=>theme.primary};
  gap : 6px;
  @media (max-width : 768px){
    padding : 12px 14px;
  }
`;
const Category = styled.div`
  width : fit-content;
  font-size : 14px;
  background : ${({theme})=>theme.primary + 20};
  color : ${({theme})=>theme.primary};
  font-weight : 500;
  
  padding : 4px 10px;
  border-radius : 8px;
`;
const Name = styled.div`
  font-size : 20px;
  color : ${({theme})=>theme.text_primary};
  font-weight : 600;
`;
const Sets = styled.div`
  font-size : 15px;
  color : ${({theme})=>theme.text_secondary};
  font-weight : 500;
`;
const Flex = styled.div`
  display : flex;
  gap : 16px;
`;
const Details = styled.div`
  display : flex;
  gap : 6px;
  font-size : 15px;
  color : ${({theme})=>theme.text_primary};
  font-weight : 500;
  align-items : center; 
`;

const Content = styled.div`
  display : flex;
  flex : 1;
  flex-direction : column;
`;

const EditDelete = styled.div`
  display:flex;
  flex-direction : row;
  gap : 6px;
`;

const editWorkout = async() => {
  const token = localStorage.getItem("trackmyfit-app-token");
}


const WorkoutCard = ({ workout, deleteWorkout}) => {
  return (
    <Card>
      <Content>
        <Category>#{workout?.category}</Category>
        <Name>{workout?.workoutName}</Name>
        <Sets>Count: {workout?.sets} sets X {workout?.reps} reps</Sets>
        <Flex>
          <Details>
            <FitnessCenterRounded sx={{ fontSize: "20px" }} />
            {workout?.weight} kg
          </Details>
          <Details>
            <TimelapseRounded sx={{ fontSize: "20px" }} />
            {workout?.duration} min
          </Details>
        </Flex>
      </Content>
      <EditDelete>
        
        {deleteWorkout && <Button text="Delete" small onClick={() => deleteWorkout(workout._id)} />}
      </EditDelete>
    </Card>
  );
};

export default WorkoutCard
