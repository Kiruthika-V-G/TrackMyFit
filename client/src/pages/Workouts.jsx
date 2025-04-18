import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import WorkoutCard from '../components/cards/WorkoutCard';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers';
import { getWorkouts, deleteWorkout as deleteWorkoutAPI } from '../api';
import { CircularProgress } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1600px;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 0.2;
  height: fit-content;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + '20'};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + '15'};
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Right = styled.div`
  flex: 1;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const SecTitle = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 16px;
`;

const Workouts = () => {
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedDate = searchParams.get('date');

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('trackmyfit-app-token');
    const dateToUse = selectedDate || dayjs().format('YYYY-MM-DD');
    try {
      const res = await getWorkouts(token, dateToUse);
      setTodaysWorkouts(res?.data?.todayWorkout || []);
    } catch (err) {
      console.error('Fetch workouts error:', err);
      setTodaysWorkouts([]);
      setError('Failed to load workouts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  const deleteWorkout = async (id) => {
    const token = localStorage.getItem('trackmyfit-app-token');
    try {
      await deleteWorkoutAPI(token, id);
      setTodaysWorkouts((prev) => prev.filter((workout) => workout._id !== id));
      setError('');
    } catch (error) {
      console.error('Delete workout error:', error);
      setError('Failed to delete workout. Please try again.');
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const handleDateChange = (e) => {
    const formatted = e.format('YYYY-MM-DD');
    setSearchParams({ date: formatted });
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Select Date</Title>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
        </Left>
        <Right>
          <Section>
            <SecTitle>Workout for {selectedDate || 'Today'}</SecTitle>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {loading ? (
              <CircularProgress />
            ) : (
              <CardWrapper>
                {todaysWorkouts.length > 0 ? (
                  todaysWorkouts.map((workout) => (
                    <WorkoutCard
                      key={workout._id}
                      workout={workout}
                      deleteWorkout={deleteWorkout}
                    />
                  ))
                ) : (
                  <div>No workouts found.</div>
                )}
              </CardWrapper>
            )}
          </Section>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Workouts;