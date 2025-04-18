import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { counts } from '../utils/data';
import CountsCard from '../components/cards/CountsCard';
import WeeklyStatCard from '../components/cards/WeeklyStatCard';
import CategoryCard from '../components/cards/CategoryCard';
import AddWorkout from '../components/AddWorkout';
import WorkoutCard from '../components/cards/WorkoutCard';
import { getDashboardDetails, getWorkouts, postWorkout, deleteWorkout as deleteWorkoutAPI } from '../api';
import dayjs from 'dayjs';

const Container = styled.div`
    display: flex;
    flex: 1;
    height: 100%;
    justify-content: center;
    padding: 20px 0;
`;

const Wrapper = styled.div`
    flex-direction: column;
    max-width: 1400px;
    flex: 1;
    display: flex;
    gap: 22px;
    @media (max-width: 768px) {
        gap: 12px;
    }
`;

const Title = styled.div`
    padding: 0 16px;
    font-size: 22px;
    color: ${({ theme }) => theme.text_primary};
    font-weight: 500;
`;

const FlexWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 22px;
    padding: 0 16px;
    @media (max-width: 768px) {
        gap: 12px;
    }
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 16px;
    gap: 20px;
    @media (max-width: 768px) {
        gap: 12px;
    }
`;

const CardWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 22px;
    margin-bottom: 90px;
    @media (max-width: 600px) {
        gap: 12px;
    }
`;

const ErrorMessage = styled.div`
    color: red;
    font-size: 16px;
    padding: 0 16px;
`;

const Dashboard = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [data, setData] = useState();
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [error, setError] = useState('');
  const [workout, setWorkout] = useState('');

  const dashboardData = useCallback(async () => {
    const token = localStorage.getItem("trackmyfit-app-token");
    try {
      const res = await getDashboardDetails(token);
      setData(res.data);
      setError('');
    } catch (e) {
      console.error('Dashboard error:', e);
      setError('Failed to load dashboard data. Please try again.');
    }
  }, []);

  const getTodaysWorkout = useCallback(async () => {
    const token = localStorage.getItem("trackmyfit-app-token");
    const today = dayjs().format("YYYY-MM-DD");
    try {
      const res = await getWorkouts(token, today);
      setTodaysWorkouts(res?.data?.todayWorkout || []);
      setError('');
    } catch (e) {
      console.error('Workouts error:', e);
      setTodaysWorkouts([]);
      setError('Failed to load workouts. Please try again.');
    }
  }, []);

  const addNewWorkout = async () => {
    setButtonLoading(true);
    const token = localStorage.getItem("trackmyfit-app-token");
    console.log('Sending workout:', workout); // Debug log
    try {
      await postWorkout(token, { workoutStr: workout });
      await Promise.all([dashboardData(), getTodaysWorkout()]);
      setWorkout(''); // Clear workout input after success
      setError('');
    } catch (e) {
      console.error('Add workout error:', e.response?.data?.msg || e.message);
      setError(e.response?.data?.msg || 'Failed to add workout. Check the format and try again.');
    } finally {
      setButtonLoading(false);
    }
  };

  const deleteWorkout = async (id) => {
    const token = localStorage.getItem("trackmyfit-app-token");
    try {
      await deleteWorkoutAPI(token, id);
      setTodaysWorkouts(prev => prev.filter(workout => workout._id !== id));
      setError('');
    } catch (error) {
      console.error('Delete workout error:', error);
      setError('Failed to delete workout. Please try again.');
    }
  };

  useEffect(() => {
    dashboardData();
    getTodaysWorkout();
  }, [dashboardData, getTodaysWorkout]);

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FlexWrap>
          {counts.map((item) => (
            <CountsCard key={item.key} item={item} data={data} />
          ))}
        </FlexWrap>
        <FlexWrap>
          <WeeklyStatCard data={data} />
          <CategoryCard data={data} />
          <AddWorkout
            workout={workout}
            setWorkout={setWorkout}
            addNewWorkout={addNewWorkout}
            buttonLoading={buttonLoading}
          />
        </FlexWrap>
        <Section>
          <Title>Today's Workout</Title>
          <CardWrapper>
            {todaysWorkouts.map((workout) => (
              <WorkoutCard
                key={workout._id}
                workout={workout}
                deleteWorkout={deleteWorkout}
              />
            ))}
          </CardWrapper>
        </Section>
      </Wrapper>
    </Container>
  );
};

export default Dashboard;