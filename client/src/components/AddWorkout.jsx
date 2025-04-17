import React from 'react'
import styled from 'styled-components';
import TextInput from './TextInput';
import Button from './Button';

const Card = styled.div`
    display : flex;
    flex : 1;
    min-width : 300px;
    padding : 24px;
    border : 1px solid ${({theme}) => theme.text_primary};
    border-radius : 14px;
    box-shadow : 1px 2px 15px 0px ${({theme}) => theme.primary};
    flex-direction: column;
    gap: 6px;
    @media (max-width: 600px) {
        padding: 16px;
    }
`;
const Title = styled.div`
    font-weight: 600;
    font-size: 16px;
    color: ${({ theme }) => theme.primary};
    @media (max-width: 600px) {
        font-size: 14px;
    }
`;

const AddWorkout = ({workout,setWorkout,addNewWorkout,buttonLoading}) => {
 
  return (
    <Card>
        <Title>
            Add New Workout
        </Title>
        <TextInput 
            label={"Workout"}
            value={workout} 
            placeholder={`Enter in this format:

#Category
-Workout Name
-SetsXReps
-Weight
-Duration;`} 
            handleChange={(e)=>setWorkout(e.target.value)} 
            textArea
            rows = {10}
            />
            <Button text="Add Workout"  onClick={()=> addNewWorkout()} isLoading={buttonLoading} isDisabled={buttonLoading}/>
    </Card>
  )
}

export default AddWorkout
