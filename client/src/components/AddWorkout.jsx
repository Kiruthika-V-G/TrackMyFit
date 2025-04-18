import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';
import Button from './Button';

const Card = styled.div`
    display: flex;
    flex: 1;
    min-width: 300px;
    padding: 24px;
    border: 1px solid ${({ theme }) => theme.text_primary};
    border-radius: 14px;
    box-shadow: 1px 2px 15px 0px ${({ theme }) => theme.primary};
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

const ErrorMessage = styled.div`
    color: red;
    font-size: 14px;
    margin-top: 8px;
`;

const AddWorkout = ({ workout, setWorkout, addNewWorkout, buttonLoading }) => {
  const [error, setError] = useState('');

  const validateWorkoutInput = (input) => {
    // Normalize input: remove extra newlines and trim
    const normalizedInput = input.replace(/\n\s*\n/g, '\n').trim();
    const lines = normalizedInput.split('\n').map(line => line.trim()).filter(Boolean);
    
    console.log('Validating workout input:', lines); // Debug log

    if (lines.length !== 5) {
      setError('Workout must have exactly 5 lines: #Category, Name, SetsXReps, Weight, Duration.');
      return false;
    }
    if (!lines[0].startsWith('#')) {
      setError('First line must start with # followed by category (e.g., #Legs).');
      return false;
    }
    if (!lines[2].match(/^\d+\s*sets\s*[xX]\s*\d+\s*reps$/i)) {
      setError('Third line must be in format "SetsXReps" (e.g., 5 setsX15 reps).');
      return false;
    }
    if (!lines[3].match(/^\d+\s*kg$/)) {
      setError('Fourth line must be a number followed by "kg" (e.g., 30 kg).');
      return false;
    }
    if (!lines[4].match(/^\d+\s*min$/)) {
      setError('Fifth line must be a number followed by "min" (e.g., 10 min).');
      return false;
    }
    setError('');
    return true;
  };

  const handleAddWorkout = () => {
    if (!validateWorkoutInput(workout)) return;
    addNewWorkout();
  };

  return (
    <Card>
      <Title>Add New Workout</Title>
      <TextInput
        label="Workout"
        value={workout}
        placeholder={`Enter in this format:\n#Category\nWorkout Name\nSetsXReps\nWeight\nDuration`}
        handleChange={(e) => setWorkout(e.target.value)}
        textArea
        rows={10}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button
        text="Add Workout"
        onClick={handleAddWorkout}
        isLoading={buttonLoading}
        isDisabled={buttonLoading || !workout.trim()}
      />
    </Card>
  );
};

export default AddWorkout;