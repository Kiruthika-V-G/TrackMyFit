import styled from 'styled-components';
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

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

const WeeklyStatCard = ({ data }) => {
  return (
    <Card>
      <Title>Weekly Calories Burnt</Title>
      {data?.totalWeeksCaloriesBurnt?.weeks?.length > 0 ? (
        <BarChart
          xAxis={[{ scaleType: "band", data: data.totalWeeksCaloriesBurnt.weeks }]}
          series={[{ data: data.totalWeeksCaloriesBurnt.caloriesBurned }]}
          height={300}
        />
      ) : (
        <div>No weekly data available.</div>
      )}
    </Card>
  );
};

export default WeeklyStatCard;