import React from 'react'
import styled from 'styled-components';
import { PieChart } from '@mui/x-charts/PieChart';

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

const CategoryCard = ({data}) => {
  return (
    <Card>
        <Title>
            Weekly Calories Burnt
        </Title>
        {data?.pieChartData && (
            <PieChart
                series = {[
                    {
                        data : data?.pieChartData,
                        innerRadius : 30,
                        outerRadius : 130,
                        paddingAngle : 5,
                        cornerRadius : 5
                    }
                ]}
            height={300}
            />
        )}
    </Card>
  )
}

export default CategoryCard
