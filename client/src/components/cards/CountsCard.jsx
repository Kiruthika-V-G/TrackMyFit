import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
    display: flex;
    flex: 1;
    justify-content: space-between;
    border: 1px solid ${({ theme }) => theme.text_primary};
    padding: 22px;
    border-radius: 10px;
    min-width: 200px;
    box-shadow: 1px 2px 15px 0 ${({ theme }) => theme.primary};
`;

const Left = styled.div`
    flex: 1;
    flex-direction: column;
    display: flex;
    gap: 10px;
    @media (max-width: 768px) {
        gap: 5px;
    }
`;

const Right = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${({ bg }) => bg};
    color: ${({ color }) => color};
    animation: rotateBounce 2s infinite ease-in-out;

    @keyframes rotateBounce {
        0% {
            transform: rotate(0deg) translateY(0);
        }
        25% {
            transform: rotate(10deg) translateY(-10px);
        }
        50% {
            transform: rotate(0deg) translateY(0);
        }
        75% {
            transform: rotate(-10deg) translateY(-10px);
        }
        100% {
            transform: rotate(0deg) translateY(0);
        }
    }
`;

const Title = styled.div`
    color: ${({ theme }) => theme.primary};
    font-weight: 590;
    font-size: 16px;
    @media (max-width: 768px) {
        font-size: 14px;
        font-weight: 550;
    }
`;

const Value = styled.div`
    font-weight: 600;
    font-size: 30px;
    color: ${({ theme }) => theme.text_primary};
    display: flex;
    gap: 8px;
    @media (max-width: 768px) {
        font-size: 22px;
    }
`;

const Unit = styled.div`
    font-size: 14px;
    margin-bottom: 8px;
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const Span = styled.div`
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 8px;
    color: ${({ positive, theme }) => (positive ? theme.green : theme.red)};
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const Desc = styled.div`
    font-size: 15px;
    color: ${({ theme }) => theme.text_secondary};
    margin-bottom: 6px;
    @media (max-width: 600px) {
        font-size: 11px;
    }
`;

const CountsCard = ({ item, data }) => {
  const percentage = data && data[item.key] && item.previousValue
    ? ((data[item.key] - item.previousValue) / item.previousValue * 100).toFixed(2)
    : 0;
  const isPositive = percentage >= 0;

  return (
    <Card>
      <Left>
        <Title>{item.name}</Title>
        <Value>
          {data && data[item.key].toFixed(2)}
          <Unit>{item.unit}</Unit>
          <Span positive={isPositive}>
            {isPositive ? `(+${percentage}%)` : `(${percentage}%)`}
          </Span>
        </Value>
        <Desc>{item.desc}</Desc>
      </Left>
      <Right bg={item.lightColor} color={item.color}>
        {item.icon}
      </Right>
    </Card>
  );
};

export default CountsCard;